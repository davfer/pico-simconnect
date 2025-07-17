import {OnDeviceReadEventCallback, OnSimReadEventCallback} from "@shared/adapters/ipc.types";
import {DataDefinition, Descriptor} from "@shared/sim.types";
import Device from "@electron/usb/device";
import {CduCell, extractCduScreenState} from "@src/features/fmc/fmc.types.ts";
import {RawBuffer} from "node-simconnect";
import log from "electron-log/main";

export interface ParsedCDUData {
    CduDataLines: CduCell[][]
    CduPowered: boolean
}

export const onSimReadEventCallbacks: Record<string, OnSimReadEventCallback> = {
    CduScreenReadFn: async (_: Descriptor, device: Device, value: ParsedCDUData) => {
        // log.log("CduScreenReadFn", descriptor, device, value)

        for (let y = 0; y < value.CduDataLines.length; y++) {
            // Will send 2 commands of 12 cells each
            let bytesToSend: number[] = []
            for (let j = 0; j < value.CduDataLines[y].length; j++) {
                const cduCell = value.CduDataLines[y][j]
                switch (cduCell.symbolNum) {
                    case 0xEA: // Placeholder
                        cduCell.symbolNum = 0x7F
                        break
                    case 0xA1: // Left Arrow
                        cduCell.symbolNum = 0x81
                        break
                    case 0xA2: // Right Arrow
                        cduCell.symbolNum = 0x80
                        break
                    case 0xA3: // Up Arrow
                        cduCell.symbolNum = 0x82
                        break
                    case 0xA4: // Down Arrow
                        cduCell.symbolNum = 0x83
                        break
                }

                bytesToSend.push(cduCell.symbolNum)
                bytesToSend.push(cduCell.color)
                bytesToSend.push(cduCell.flags)
            }

            // SET_PIXEL [x, y, count, {char, color, type}...]
            await device.sendCmd(0x01, [0, y, 12, ...bytesToSend.slice(0, 36)]);
            // SET_PIXEL [x, y, count, {char, color, type}...]
            await device.sendCmd(0x01, [12, y, 12, ...bytesToSend.slice(36)]);
        }
    },

    MultipanelSimDataReadFn: async (descriptor: Descriptor, device: Device, value: any) => {
        log.log("MultipanelSimDataReadFn", descriptor, device, value)
        // Handle multipanel data read
        // This is a placeholder for actual implementation
    },
};

export const onDeviceReadEventCallbacks: Record<string, OnDeviceReadEventCallback> = {}

export const onDataParserEventCallbacks: Record<string, (defs: DataDefinition[], data: RawBuffer) => any> = {
    CduScreenParseFn: (_: DataDefinition[], data: RawBuffer): ParsedCDUData => {
        //console.log("CduScreenParseFn", data);

        const cduData = extractCduScreenState(data);
        // console.log("CduScreenParseFn", cduData);

        return {
            CduDataLines: cduData.lines,
            CduPowered: cduData.powered
        }
    },
}