import {RawBuffer} from "node-simconnect";

export interface Pixel {
    char: string
    color: "white" | "green" | "red" | "amber"
}

export interface CduData {
    lines: string[]
    powered: boolean
}

export function extractCduScreenState(buffer: RawBuffer): CduData {
    const CDU_COLUMNS = 24;
    const CDU_ROWS = 14;
    const screenText: string[] = Array(CDU_ROWS).fill('');

    for (let col = 0; col < CDU_COLUMNS; col++) {
        for (let row = 0; row < CDU_ROWS; row++) {
            const symbol = buffer.readBytes(1).toString("utf-8") // I tried readString(1) but that only works with zero-terminated strings, which doesn't seem to be used here
            const color = buffer.readBytes(1)[0]
            const flags = buffer.readBytes(1)[0]
            screenText[row] += symbol
        }
    }
    const cduPowered = buffer.readBytes(1)[0] === 1


    // console.trace("Successfully extracted CDU screen state:", screenText)
    return {
        lines: screenText,
        powered: cduPowered
    };
}

