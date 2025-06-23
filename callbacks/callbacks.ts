import {OnDeviceReadEventCallback, OnSimReadEventCallback} from "@shared/adapters/ipc.types";
import {DataDefinitionType, Descriptor} from "@shared/sim.types";
import Device from "@electron/usb/device";
import {extractCduScreenState} from "@src/features/fmc/fmc.types.ts";
import {PMDG_NG3_Data} from "@shared/definitions/PMDG_NG3_SDK.ts";
import log from "electron-log/main";

export const onSimReadEventCallbacks: Record<string, OnSimReadEventCallback> = {
    CduScreenReadFn: async (descriptor: Descriptor, device: Device, value: any) => {
        log.log("CduScreenReadFn", descriptor, device, value)

        const data = extractCduScreenState(value)
        for (let y = 0; y < data.lines.length; y++) {
            // Will send 2 commands of 12 cells each
            let bytesToSend = []
            for (let j = 0; j < data.lines[y].length; j++) {
                bytesToSend.push(data.lines[y].charCodeAt(j))
                bytesToSend.push(0) // padding byte
                bytesToSend.push(0) // padding byte
            }

            // SET_PIXEL [x, y, count, {char, color, type}...]
            await device.sendCmd(0x01, [0, y, 12, ...bytesToSend.slice(0, 36)]);
            // SET_PIXEL [x, y, count, {char, color, type}...]
            await device.sendCmd(0x01, [12, y, 12, ...bytesToSend.slice(36)]);
        }
    }
};

export const onDeviceReadEventCallbacks: Record<string, OnDeviceReadEventCallback> = {
    // CduButtonPressFn: (item: BoardInterface, sim: Sim, value: any) => {
    //     console.info("CduButtonPressFn", item, sim, value);
    // }
}

export const onDataParserEventCallbacks: Record<string, (data: Buffer) => any> = {
    CduScreenParseFn: (data: Buffer) => {
        //console.trace("CduScreenParseFn", data);

        const cduData = extractCduScreenState(data);
        return {"CduDataLines": cduData.lines, "CduPowered": cduData.powered};
    },
    PmdgNg3DataParseFn: (data: Buffer) => {
        //console.trace("PmdgNg3DataParseFn", data);

        let result: Record<string, any> = {};
        let offset = 0;
        for (const i in PMDG_NG3_Data) {
            const def = PMDG_NG3_Data[i];
            const size = def.size || 1;

            let values = [];
            for (let j = 0; j < size; j++) {
                if (offset >= data.length) {
                    // TODO Reenable once we have sim connected
                    //console.warn(`PmdgNg3DataParseFn: Offset ${offset} exceeds data length ${data.length}`);
                    break;
                }

                switch (def.dataType) {
                    case DataDefinitionType.BOOLEAN:
                        values.push(data.readUInt8(offset) !== 0);
                        break;
                    case DataDefinitionType.CHAR:
                        values.push(data.readUInt8(offset));
                        break;
                }
                offset++;
            }
            result[def.name] = values.length === 1 ? values[0] : values;
        }

        return result;
    }
}