import {Sim} from "./simconnect/sim.ts";
import {BoardInterface, BoardInterfaceType, BoardItem} from "@shared/board.types.ts";
import Device from "./usb/device.ts";
import {onDeviceReadEventCallbacks, onSimReadEventCallbacks} from "@callbacks/callbacks.ts";

export default class Board {
    private readonly device: Device;
    private listeners = new Map<string, (id: string, value: number) => void>();

    constructor(private sim: Sim, vendorId: number, productId: number, private items: BoardItem[]) {
        const interfaces = items.filter(item => !!item.iface).map(item => item.iface) as BoardInterface[];
        this.device = new Device(vendorId, productId, interfaces);
        for (const item of items) {
            // Register into the sim the board items that have a sim property
            if (item.sim) {
                item.sim.callback = (cbDescriptor, value) => {
                    if (item.onSimReadFnName) {
                        const dalCallback = onSimReadEventCallbacks[item.onSimReadFnName]
                        if (dalCallback) {
                            console.info(`Calling DAL SIM callback ${item.onSimReadFnName} with value ${value}`);
                            dalCallback(cbDescriptor, this.device, value);
                        } else {
                            console.warn(`No DAL SIM callback found for ${item.onSimReadFnName}`);
                        }
                    }
                    if (item.sim?.type == "event" || item.sim?.type == "data") {
                        const eventCallback = this.listeners.get(item.id);
                        if (eventCallback) {
                            console.info(`Triggering FRONTEND for ${item.id} with value ${value}`);
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
                    }
                    if (item.iface?.type == BoardInterfaceType.BUTTON) {
                        const eventCallback = this.listeners.get(item.id);
                        if (eventCallback) {
                            console.info(`Triggering FRONTEND for ${item.id} with value ${value.value}`);
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
            return this.device.trigger(item.iface.id, value);
        }
        if (item.sim && (item.sim.type === "write")) {
            return this.sim.trigger(item.id, value);
        }
    }
}