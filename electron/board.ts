import {BoardInterface, BoardInterfaceType, BoardItem} from "@shared/board.types.ts";
import Device from "./usb/device.ts";
import {onDataParserEventCallbacks, onDeviceReadEventCallbacks, onSimReadEventCallbacks} from "@callbacks/callbacks.ts";
import {ISim} from "@electron/simconnect/sim.types.ts";
import {DataDescriptor, ReadDescriptor} from "@shared/sim.types.ts";

export default class Board {
    private readonly device: Device;
    private listeners = new Map<string, (id: string, value: number) => void>();

    constructor(private sim: ISim, vendorId: number, productId: number, private items: BoardItem[]) {
        const interfaces = items.filter(item => !!item.iface).map(item => item.iface) as BoardInterface[];
        this.device = new Device(vendorId, productId, interfaces, 100);
        for (const item of items) {
            // Register into the sim the board items that have a sim property
            if (item.sim) {
                item.sim.callback = (cbDescriptor, value) => {
                    // Can we parse the raw data?
                    if (item.sim?.type == "data") {
                        const dDef = item.sim as DataDescriptor
                        if (dDef.dataParserFnName) {
                            const dplCallback = onDataParserEventCallbacks[dDef.dataParserFnName]
                            if (dplCallback) {
                                const parsed = dplCallback(value);
                                //console.trace(`Called DPL SIM callback ${dDef.dataParserFnName} got`, parsed);

                                for (const [key, val] of Object.entries(parsed)) {
                                    const readItem = this.items.find(
                                        i => i.sim?.type == "read" && (i.sim as ReadDescriptor).name === key
                                    );
                                    if (readItem?.sim?.callback) {
                                        //console.trace(`Triggering SIM READ for ${key} with value ${val}`);
                                        try {
                                            readItem.sim.callback(readItem.sim, val as any);
                                        } catch (err) {
                                            // not our problem
                                        }
                                    }
                                }
                            } else {
                                console.warn(`No DPL SIM callback found for ${dDef.dataParserFnName}`);
                            }
                        }
                    }
                    // Does it has a DAL callback attached?
                    if (item.onSimReadFnName) {
                        const dalCallback = onSimReadEventCallbacks[item.onSimReadFnName]
                        if (dalCallback) {
                            //console.trace(`Calling DAL SIM callback ${item.onSimReadFnName} with value`, value);
                            dalCallback(cbDescriptor, this.device, value);
                        } else {
                            console.warn(`No DAL SIM callback found for ${item.onSimReadFnName}`);
                        }
                    }

                    if (item.sim?.type == "read") {
                        const eventCallback = this.listeners.get(item.id);
                        if (eventCallback) {
                            //console.trace(`Triggering FRONTEND for ${item.id} with value ${value}`);
                            eventCallback(item.id, value);
                        }
                    }
                }
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

    public trigger(id: string, value: number) {
        if (!this.device) {
            throw new Error('Device not opened');
        }

        const item = this.items.find(i => i.id === id);
        if (!item) {
            throw new Error(`Item with id ${id} not found`);
        }

        if (item.iface && item.iface.type === BoardInterfaceType.LED) {
            this.device.trigger(item.iface.id, value);
        } else if (item.sim && item.sim.type === "write") {
            this.sim.trigger(item.id, value);
        } else {
            throw new Error(`Item with id ${id} is not a triggerable interface or sim item`);
        }
    }
}