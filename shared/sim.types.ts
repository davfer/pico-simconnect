export type EventCallback = (descriptor: Descriptor, value: any) => void

export interface Descriptor {
    id: string; // Unique identifier for the descriptor
    simid: number; // ClientEventID (RequestID)
    callback?: EventCallback;
    type: 'event' | 'data' | 'write' | 'cdu';
}

export interface WriteDescriptor extends Descriptor {
    hwid: number; // eventNameID
}

export interface CduDescriptor extends Descriptor {
    size: number; // Size of the CDU data
    dataName: string; // Name of the CDU data
    dataId: number; // ID of the CDU data
    dataDefinition: number; // Definition of the CDU data
}