import {BoardInterface, BoardItem} from "../board.types";
import Device from "@electron/usb/device.ts";
import {Descriptor} from "@shared/sim.types.ts";
import {ISim} from "@electron/simconnect/sim.types.ts";

export type OnSimReadEventCallback = (descriptor: Descriptor, device: Device, value: any) => void
export type OnDeviceReadEventCallback = (item: BoardInterface, sim: ISim, value: any) => void

export interface InitBoardProps {
    id: string,
    vendorId: number,
    productId: number,
    items: BoardItem[]
}

export interface GenericResponse {
    success: boolean;
    error?: string;
}

export interface TriggerBoardProps {
    id: string;
    itemId: string;
    value: number;
}