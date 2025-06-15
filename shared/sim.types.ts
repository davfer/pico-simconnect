export type EventCallback = (descriptor: Descriptor, value: any) => void

export interface SimOffset {
    offset: number;
    type: 'event' | 'data' | 'write';
}

export interface Descriptor {
    swid: string;
    hwid: number;
    callback: EventCallback;
    type: 'event' | 'data' | 'write';
}