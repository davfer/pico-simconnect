import {Descriptor} from "@shared/sim.types.ts";

export interface ISim {
    connect(): Promise<void>;
    disconnect(): Promise<void>;
    register(descriptor: Descriptor): void;
    trigger(id: string, value: number): void;
}