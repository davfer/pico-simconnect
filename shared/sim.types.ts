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
    BOOLEAN = 5, // SimConnectDataType.STRING8,
    CHAR = 5, // SimConnectDataType.STRING8,
    FLOAT = 3, //SimConnectDataType.FLOAT32,
    UINT = 1, //SimConnectDataType.INT32,
    SHORT = 1,    //SimConnectDataType.INT32,
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
}