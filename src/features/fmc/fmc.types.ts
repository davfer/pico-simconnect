export interface Pixel {
    char: string
    color: "white" | "green" | "red" | "amber"
}

export interface CduData {
    lines: string[]
    powered: boolean
}

export interface RawBuffer {
    readBytes: (length: number) => Buffer
}

export function extractCduScreenState(buffer: Buffer): CduData {
    if (!buffer || !buffer.length) {
        console.error(`Invalid rawBuffer: ${JSON.stringify(buffer)}`)
        throw new Error("Invalid rawBuffer provided to extractCduScreenState");
    }
    const CDU_COLUMNS = 24;
    const CDU_ROWS = 14;
    const screenText: string[] = Array(CDU_ROWS).fill('');

    for (let col = 0; col < CDU_COLUMNS; col++) {
        for (let row = 0; row < CDU_ROWS; row++) {
            const offset = (row * CDU_COLUMNS + col) * 3; // Each character is 3 bytes: char, color, flags
            // I tried readString(1) but that only works with zero-terminated strings, which doesn't seem to be used here
            const symbol = String.fromCharCode(buffer.readUInt8(offset + 0));
            // These values are not used in this example
            const color = buffer.readUInt8(offset + 1);
            const flags = buffer.readUInt8(offset + 2);

            screenText[row] += symbol;
        }
    }
    const cduIsPowered = buffer.readUInt8(buffer.length - 1) === 1;


    console.info("Successfully extracted CDU screen state:", screenText)
    return {
        lines: screenText,
        powered: cduIsPowered
    };
}

export function extractPmdgData(buffer: Buffer):  {

}
