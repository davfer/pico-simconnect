import {Board, BoardInterface} from "../board.types";
import {Descriptor} from "@shared/sim.types.ts";
import {ISim} from "@electron/simconnect/sim.types.ts";
import Usb from "@electron/usb/usb.ts";

export type OnSimReadEventCallback = (descriptor: Descriptor, device: Usb, value: any) => void
export type OnDeviceReadEventCallback = (item: BoardInterface, sim: ISim, value: any) => void

export interface InitBoardProps extends Board {
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