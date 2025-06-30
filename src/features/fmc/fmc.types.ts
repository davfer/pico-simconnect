import {RawBuffer} from "node-simconnect";

export interface CduData {
    lines: CduCell[][]
    powered: boolean
}

export enum CduCellColor {
    WHITE = 0,
    CYAN = 1,
    GREEN = 2,
    MAGENTA = 3,
    AMBER = 4,
    RED = 5
}

export interface CduCell {
    symbol: string
    color: CduCellColor
    flags: number // 0 = normal, 1 = small, 2 = reversed, 4 = unused
}

export function extractCduScreenState(buffer: RawBuffer): CduData {
    const CDU_COLUMNS = 24;
    const CDU_ROWS = 14;
    const screenCells: CduCell[][] = Array(CDU_ROWS).fill([]);

    for (let col = 0; col < CDU_COLUMNS; col++) {
        for (let row = 0; row < CDU_ROWS; row++) {
            const symbol = buffer.readBytes(1).toString("utf-8") // I tried readString(1) but that only works with zero-terminated strings, which doesn't seem to be used here
            const color = buffer.readBytes(1)[0]
            const flags = buffer.readBytes(1)[0]

            screenCells[row].push( {
                symbol: symbol,
                color: color as CduCellColor,
                flags: flags
            })
        }
    }
    const cduPowered = buffer.readBytes(1)[0] === 1


    // console.trace("Successfully extracted CDU screen state:", screenText)
    return {
        lines: screenCells,
        powered: cduPowered
    };
}

