export type EventCallback = (descriptor: Descriptor, value: any) => void

export interface Descriptor {
    id: string; // Unique identifier for the descriptor
    simid: number; // ClientEventID (RequestID)
    callback?: EventCallback;
    type: 'data' | 'write' | 'read';
}

export interface WriteDescriptor extends Descriptor {
    hwid: number; // eventNameID
    values?: Record<string, number>; // Value to write
    read?: ReadDescriptor
}

export interface ReadDescriptor extends Descriptor {
    name: string; // Name of the data definition
    position?: number; // Position in the data buffer
}

export enum DataDefinitionType {
    BOOLEAN, // SimConnectDataType.STRING8,
    CHAR, // SimConnectDataType.STRING8,
    FLOAT, //SimConnectDataType.FLOAT32,
    DOUBLE, //SimConnectDataType.FLOAT32,
    UINT, //SimConnectDataType.UINT32,
    SHORT,    //SimConnectDataType.INT32,
    USHORT,    //SimConnectDataType.UINT32,
    CUSTOM,
}

export function CalculateBytes(d: DataDefinitionType): number {
    switch (d) {
        case DataDefinitionType.BOOLEAN:
            return 1
        case DataDefinitionType.UINT:
            return 4
        case DataDefinitionType.SHORT:
            return 2
        case DataDefinitionType.CHAR:
            return 1
        case DataDefinitionType.FLOAT:
            return 4
        case DataDefinitionType.DOUBLE:
            return 8
        case DataDefinitionType.USHORT:
            return 2
        case DataDefinitionType.CUSTOM:
            return 1
    }
}

export function CalculateSize(definitions: DataDefinition[]): number {
    return definitions.reduce((acc, def) => {
        return acc + ((def.size || 1) * CalculateBytes(def.dataType))
    }, 0);
}

export interface DataDefinition<T = unknown> {
    name: string // Name of the data definition
    unit: string // Unit of the data definition
    dataType: DataDefinitionType
    size?: number // Size of the data definition, optional for some types
    parser?: (data: Buffer) => T
}

// export interface DataDefinitionDescriptor extends Descriptor {
//     defid: number // DataDefinitionID
//     definitions: DataDefinition[]
// }

export interface DataDescriptor extends Descriptor {
    size: number; // Size of the CDU data
    dataName: string; // Name of the CDU data
    dataId: number; // ID of the CDU data
    dataDefinition: number; // Definition of the CDU data
    dataParserFnName?: string; // Optional parser for the data
    dataUpdateOnChange?: boolean
    dataLayout?: DataDefinition[]
    strategy: 'clientData' | 'simObjectData'
}