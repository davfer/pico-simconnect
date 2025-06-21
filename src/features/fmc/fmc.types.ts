import {RawBuffer} from "node-simconnect";

export interface Pixel {
    char: string
    color: "white" | "green" | "red" | "amber"
}

export interface CduData {
    lines: string[]
    powered: boolean
}

export function extractCduScreenState(rawBuffer: RawBuffer): CduData {
    const CDU_COLUMNS = 24;
    const CDU_ROWS = 14;
    const screenText: string[] = Array(CDU_ROWS).fill('');

    for (let col = 0; col < CDU_COLUMNS; col++) {
        for (let row = 0; row < CDU_ROWS; row++) {
            // I tried readString(1) but that only works with zero-terminated strings, which doesn't seem to be used here
            const symbol = rawBuffer.readBytes(1).toString('utf-8');
            // These values are not used in this example
            // const color = rawBuffer.readBytes(1)[0];
            // const flags = rawBuffer.readBytes(1)[0];

            screenText[row] += symbol;
        }
    }
    const cduIsPowered = rawBuffer.readBytes(1)[0] === 1;

    return {
        lines: screenText,
        powered: cduIsPowered
    };
}

export const nativeCallbacks: Record<string, (data: any) => void> = {

}