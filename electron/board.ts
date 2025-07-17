import {BoardInterface, BoardInterfaceType, BoardItem} from "@shared/board.types.ts";
import Device from "./usb/device.ts";
import {onDataParserEventCallbacks, onDeviceReadEventCallbacks, onSimReadEventCallbacks} from "@callbacks/callbacks.ts";
import {ISim} from "@electron/simconnect/sim.types.ts";
import {DataDefinition, DataDefinitionType, DataDescriptor, EventCallback, ReadDescriptor} from "@shared/sim.types.ts";
import {RawBuffer} from "node-simconnect";

export default class Board {
    private readonly device: Device;
    private listeners = new Map<string, (id: string, value: number) => void>();

    constructor(private sim: ISim, vendorId: number, productId: number, private items: BoardItem[]) {
        const interfaces = items.filter(item => !!item.iface).map(item => item.iface) as BoardInterface[];
        this.device = new Device(vendorId, productId, interfaces, 10000);
        for (const item of items) {
            // Register into the sim the board items that have a sim property
            if (item.sim) {
                console.info(`Registering SIM item ${item.id} of type ${item.sim.type}`);
                item.sim.callback = this.itemCallbackHandler(item)
                this.sim.register(item.sim)
            }
            // Register the item to the hw device if it has an interface
            if (item.iface) {
                this.device.onChange(item.iface.id, (value) => {
                    if (item.onDeviceReadFnName) {
                        const dalCallback = onDeviceReadEventCallbacks[item.onDeviceReadFnName]
                        if (dalCallback) {
                            console.info(`Calling DAL DEV callback ${item.onDeviceReadFnName} with value ${value.value}`);
                            dalCallback(item.iface as BoardInterface, this.sim, value);
                        } else {
                            console.warn(`No DAL DEV callback found for ${item.onDeviceReadFnName}`);
                        }
                    } else if (item.sim && value?.value) {
                        // If no DAL defined and the item has a sim property, we can trigger it directly
                        this.sim.trigger(item.sim.id, value.value);
                    }
                    if (item.iface?.type == BoardInterfaceType.BUTTON) {
                        const eventCallback = this.listeners.get(item.id);
                        if (eventCallback) {
                            //console.trace(`Triggering FRONTEND for ${item.id} with value ${value.value}`);
                            eventCallback(item.id, value.value);
                        }
                    }
                })
            }
        }
    }

    async open() {
        await this.device.open();
    }

    async close() {
        await this.device.close();
    }

    public onChange(id: string, callback: (id: string, value: number) => void) {
        if (this.listeners.has(id)) {
            console.warn(`Listener for ${id} already exists`);
            return;
        }
        this.listeners.set(id, callback);
    }

    public async trigger(id: string, value: number) {
        if (!this.device) {
            throw new Error('Device not opened');
        }

        const item = this.items.find(i => i.id === id);
        if (!item) {
            throw new Error(`Item with id ${id} not found`);
        }

        if (item.iface && item.iface.type === BoardInterfaceType.LED) {
            await this.device.trigger(item.iface.id, value);
        } else if (item.sim && item.sim.type === "write") {
            this.sim.trigger(item.sim.id, value);
        } else {
            throw new Error(`Item with id ${id} is not a triggerable interface or sim item`);
        }
    }

    private itemCallbackHandler(item: BoardItem): EventCallback {
        return (cbDescriptor, value) => {
            let data = value

            // Can we parse the raw data?
            if (item.sim?.type == "data") {
                const dDef = item.sim as DataDescriptor
                if (dDef.dataParserFnName) {
                    const dplCallback = onDataParserEventCallbacks[dDef.dataParserFnName]
                    if (dplCallback) {
                        data = dplCallback(dDef.dataLayout || [], value);
                        //console.trace(`Called DPL SIM callback ${dDef.dataParserFnName} got`, parsed);
                    } else {
                        console.warn(`No DPL SIM callback found for ${dDef.dataParserFnName}`);
                    }
                } else if (dDef.dataLayout) {
                    data = this.parseData(dDef.dataLayout, value)
                } else {
                    data = value
                }

                for (const [key, val] of Object.entries(data)) {
                    const readItem = this.items.find(
                        i => i.sim?.type == "read" && (i.sim as ReadDescriptor).name === key
                    );
                    if (readItem?.sim?.callback) {
                        //console.info(`Triggering SIM READ for ${key} with value ${val}`);
                        try {
                            readItem.sim.callback(readItem.sim, val as any);
                        } catch (err) {
                            // not our problem
                        }
                    }
                }
            } else if (item.sim?.type == "read") {
                const eventCallback = this.listeners.get(item.id);
                if (eventCallback) {
                    // console.info(`Triggering FRONTEND for ${item.id} with value ${data}`);
                    eventCallback(item.id, data);
                }
            }

            // Does it have a DAL callback attached?
            if (item.onSimReadFnName) {
                const dalCallback = onSimReadEventCallbacks[item.onSimReadFnName]
                if (dalCallback) {
                    //console.info(`Calling DAL SIM callback ${item.onSimReadFnName} with value`, data);
                    dalCallback(cbDescriptor, this.device, data);
                } else {
                    console.warn(`No DAL SIM callback found for ${item.onSimReadFnName}`);
                }
            }
        }
    }

    private parseData(defs: DataDefinition[], data: RawBuffer): any {
        let result: Record<string, any> = {};
        for (const i in defs) {
            const def = defs[i];
            const size = def.size || 1;
            let values = [];


            if (def.dataType == DataDefinitionType.CUSTOM) {
                result[def.name] = data.readBytes(def.size || 1);
                continue
            }

            for (let j = 0; j < size; j++) {
                if (data.remaining() <= 0) {
                    console.error(`parseData: Exceeds data length ${def.name}`);
                    break;
                }

                switch (def.dataType) {
                    case DataDefinitionType.BOOLEAN:
                        values.push(data.readBytes(1).readInt8() !== 0);
                        break;
                    case DataDefinitionType.CHAR:
                        values.push(data.readBytes(1).readInt8());
                        break;
                    case DataDefinitionType.FLOAT:
                        values.push(data.readFloat32())
                        break
                    case DataDefinitionType.DOUBLE:
                        values.push(data.readFloat64())
                        break
                    case DataDefinitionType.SHORT:
                        values.push(data.readInt16())
                        break
                    case DataDefinitionType.USHORT:
                        values.push(data.readInt16())
                        break
                    case DataDefinitionType.UINT:
                        values.push(data.readInt32())
                        break
                }
            }
            result[def.name] = values.length === 1 ? values[0] : values;
        }
    }
}