import {Descriptor} from "@shared/sim.types.ts";

export interface Board {
    id: string;
    vendorId: number;
    productId: number;
    items: BoardItem[];
}

export interface BoardItem {
    id: string
    front?: FrontItem;
    iface?: BoardInterface
    sim?: Descriptor

    // Direct Access Logic (use registry to allow serialization)
    onSimReadFnName?: string
    onDeviceReadFnName?: string
}

export interface FrontItem {
    type: "button" | "switch" | "analog" | "led" | "encoder";
}

export interface ButtonItem extends FrontItem {
    value?: string;
    style: "square" | "circle" | "rectangle" | "rectangle-sm";
}

export interface SwitchItem extends FrontItem {
    values: { name: string, value: number }[];
    style: "square" | "rotary"
}

export interface EncoderItem extends FrontItem {

}

export interface AnalogItem extends FrontItem {
    min: number;
    max: number;
    style: "slider" | "knob" | "input";
}

export interface LedItem extends FrontItem {
    style: "square" | "circle" | "rectangle" | "rectangle-sm";
    color: "red" | "green" | "blue" | "yellow" | "white";
}

export interface BoardInterface {
    id: string
    type: BoardInterfaceType
    value: BoardInterfaceValue
}

export interface BoardButton extends BoardInterface {
    offset: number;
}

export interface BoardSwitch extends BoardInterface {
    offsets: { name: string, offset?: number, value: number }[];
}

export interface BoardAnalog extends BoardInterface {
    offset: number;
}

export interface BoardEncoder extends BoardInterface {
    offset: number;
}

export interface BoardLed extends BoardInterface {
    offset: number;
}

export interface BoardDisplay extends BoardInterface {
    offset: number;
}

export interface BoardInterfaceValue {
    value: number;
    lastValueChange: Date
    previousValue: number;
}

export enum BoardInterfaceType {
    BUTTON = 'button',
    SWITCH = 'switch',
    ANALOG = 'analog',
    LED = 'led',
    ENCODER = 'encoder',
    DISPLAY = 'display',
}

export enum TriggerType {
    PRESSED = 'pressed',
    RELEASED = 'released',
}