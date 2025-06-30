import {OnDeviceReadEventCallback, OnSimReadEventCallback} from "@shared/adapters/ipc.types";
import {DataDefinitionType, Descriptor} from "@shared/sim.types";
import Device from "@electron/usb/device";
import {CduCell, extractCduScreenState} from "@src/features/fmc/fmc.types.ts";
import {PMDG_NG3_Data} from "@shared/definitions/PMDG_NG3_SDK.ts";
import log from "electron-log/main";
import {RawBuffer} from "node-simconnect";

export interface ParsedCDUData {
    CduDataLines: CduCell[][]
    CduPowered: boolean
}

export const onSimReadEventCallbacks: Record<string, OnSimReadEventCallback> = {
    CduScreenReadFn: async (descriptor: Descriptor, device: Device, value: ParsedCDUData) => {
        log.log("CduScreenReadFn", descriptor, device, value)

        for (let y = 0; y < value.CduDataLines.length; y++) {
            // Will send 2 commands of 12 cells each
            let bytesToSend = []
            for (let j = 0; j < value.CduDataLines[y].length; j++) {
                bytesToSend.push(value.CduDataLines[y][j].symbol)
                bytesToSend.push(value.CduDataLines[y][j].color)
                bytesToSend.push(value.CduDataLines[y][j].symbol)
            }

            // TODO: Reenable
            // SET_PIXEL [x, y, count, {char, color, type}...]
            // await device.sendCmd(0x01, [0, y, 12, ...bytesToSend.slice(0, 36)]);
            // SET_PIXEL [x, y, count, {char, color, type}...]
            // await device.sendCmd(0x01, [12, y, 12, ...bytesToSend.slice(36)]);
        }
    }
};

export const onDeviceReadEventCallbacks: Record<string, OnDeviceReadEventCallback> = {
    // CduButtonPressFn: (item: BoardInterface, sim: Sim, value: any) => {
    //     console.info("CduButtonPressFn", item, sim, value);
    // }
}

export const onDataParserEventCallbacks: Record<string, (data: RawBuffer) => any> = {
    CduScreenParseFn: (data: RawBuffer) : ParsedCDUData => {
        //console.log("CduScreenParseFn", data);

        const cduData = extractCduScreenState(data);
        return {
            CduDataLines: cduData.lines,
            CduPowered: cduData.powered
        }
    },
    PmdgNg3DataParseFn: (data: RawBuffer) => {
        // console.log("PmdgNg3DataParseFn", data.remaining(), PMDG_NG3_Data_Size());

        let result: Record<string, any> = {};
        for (const i in PMDG_NG3_Data) {
            const def = PMDG_NG3_Data[i];
            const size = def.size || 1;
            let values = [];


            if (def.dataType == DataDefinitionType.CUSTOM) {
                result[def.name] = data.readBytes(def.size || 1);
                continue
            }

            for (let j = 0; j < size; j++) {
                if (data.remaining() <= 0) {
                    console.error(`PmdgNg3DataParseFn: Exceeds data length ${def.name}`);
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
        //console.log(JSON.stringify(result));

        return result;
    }
}