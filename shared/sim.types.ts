// import {SimConnectDataType} from "node-simconnect";

export type EventCallback = (descriptor: Descriptor, value: any) => void

export interface Descriptor {
    id: string; // Unique identifier for the descriptor
    simid: number; // ClientEventID (RequestID)
    callback?: EventCallback;
    type: 'data' | 'write' | 'read';
}

export interface WriteDescriptor extends Descriptor {
    hwid: number; // eventNameID
}

export interface ReadDescriptor extends Descriptor {
    name: string; // Name of the data definition
}

export enum DataDefinitionType {
    BOOLEAN, // SimConnectDataType.STRING8,
    CHAR, // SimConnectDataType.STRING8,
    FLOAT, //SimConnectDataType.FLOAT32,
    UINT, //SimConnectDataType.INT32,
    SHORT,    //SimConnectDataType.INT32,
}

export function DataDefinitionToSimConnectDataType(type: DataDefinitionType): number {
    switch (type) {
        case DataDefinitionType.BOOLEAN:
        case DataDefinitionType.CHAR:
            return 5; // SimConnectDataType.STRING8
        case DataDefinitionType.FLOAT:
            return 3; // SimConnectDataType.FLOAT32
        case DataDefinitionType.UINT:
            return 1; // SimConnectDataType.INT32
        case DataDefinitionType.SHORT:
            return 1; // SimConnectDataType.INT32
        default:
            throw new Error(`Unsupported data definition type: ${type}`);
    }
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
}