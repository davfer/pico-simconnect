import {OnDeviceReadEventCallback, OnSimReadEventCallback} from "../shared/adapters/ipc.types";
import {Descriptor} from "../shared/sim.types";
import Device from "../electron/usb/device";
import {extractCduScreenState} from "@src/features/fmc/fmc.types.ts";

export const onSimReadEventCallbacks: Record<string, OnSimReadEventCallback> = {
    CduScreenReadFn: async (descriptor: Descriptor, device: Device, value: any) => {
        console.info("CduScreenReadFn", descriptor, device, value)

        const data = extractCduScreenState(value)
        for (let i = 0; i < data.lines.length; i++) {
            // Will send 2 commands of 12 cells each
            let bytesToSend = []
            for (let j = 0; j < data.lines[i].length; j++) {
                bytesToSend.push(data.lines[i].charCodeAt(0))
                bytesToSend.push(0) // padding byte
                bytesToSend.push(0) // padding byte
            }

            // SET_PIXEL [x, y, count, {char, color, type}...]
            await device.sendCmd(0x01, [0, 0, 12, ...bytesToSend.slice(0, 36)]);
            // SET_PIXEL [x, y, count, {char, color, type}...]
            await device.sendCmd(0x01, [0, 12, 12, ...bytesToSend.slice(36)]);
        }
    },
    PmdgNg3DataReadFn: async (descriptor: Descriptor, device: Device, value: any) => {
        console.info("PmdgNg3DataReadFn", descriptor, device, value);
    }
};

export const onDeviceReadEventCallbacks: Record<string, OnDeviceReadEventCallback> = {
    // CduButtonPressFn: (item: BoardInterface, sim: Sim, value: any) => {
    //     console.info("CduButtonPressFn", item, sim, value);
    // }
}