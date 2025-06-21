import {OnDeviceReadEventCallback, OnSimReadEventCallback} from "../shared/adapters/ipc.types";
import {Descriptor} from "../shared/sim.types";
import Device from "../electron/usb/device";
import {BoardInterface} from "../shared/board.types";
import {Sim} from "../electron/simconnect/sim";

export const onSimReadEventCallbacks: Record<string, OnSimReadEventCallback> = {
    CduScreenReadFn: (descriptor: Descriptor, device: Device, value: any) => {
        console.info("CduScreenReadFn", descriptor, device, value)
    }
};

export const onDeviceReadEventCallbacks: Record<string, OnDeviceReadEventCallback> = {
    CduButtonPressFn: (item: BoardInterface, sim: Sim, value: any) => {
        console.info("CduButtonPressFn", item, sim, value);
    }
}