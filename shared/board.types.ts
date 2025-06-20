import {Descriptor} from "@shared/sim.types.ts";

export interface ButtonItem {
    value: string;
    style: "square" | "circle" | "rectangle" | "rectangle-sm";
}

export interface BoardItem {
    id: string
    front?: ButtonItem;
    iface?: BoardInterface
    sim?: Descriptor

    // Direct Access Logic (use registry to allow serialization)
    onSimReadFnName?: string
    onDeviceReadFnName?: string
}

export interface BoardItemRef {
    interaction: boolean
    value: number
}

export interface BoardInterface {
    id: string;
    type: BoardInterfaceType;
}

export interface BoardButton extends BoardInterface {
    offset: number;
    value: BoardInterfaceValue
}

export interface BoardLed extends BoardInterface {
    offset: number;
    value: BoardInterfaceValue
}

export interface BoardInterfaceValue {
    value: number;
    lastValueChange: Date
    previousValue: number;
}

export enum BoardInterfaceType {
    BUTTON = 'button',
    LED = 'led',
}

export enum TriggerType {
    PRESSED = 'pressed',
    RELEASED = 'released',
}