import {DataDefinitionType, DataDescriptor, Descriptor} from "@shared/sim.types.ts";
import {PMDG_NG3_Data, PMDG_NG3_Data_Size} from "@shared/definitions/PMDG_NG3_SDK.ts";
import {RawBuffer} from "node-simconnect";

export class Mocksim {
    private connected = false;
    private descriptors: Descriptor[] = [];

    constructor() {
        setInterval(() => {
            if (!this.connected) {
                return
            }

            // Simulate a periodic event, e.g., a data update
            const dataDescriptors = this.descriptors.filter(d => d.type === "data") as DataDescriptor[]
            for (const dd of dataDescriptors) {
                if (!dd.callback) {
                    continue;
                }

                let dataToSend: Buffer;
                if (dd.id === "cdu_SCREEN") {
                    let cduScreen : string[][] = [
                        [" "," "," "," "," "," "," "," ","I","D","E","N","T"," "," "," "," "," "," "," "," ","1","/","2"],
                        [" ","M","O","D","E","L"," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "],
                        ["7","3","7","-","8","0","0","W"," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "],
                        [" ","R","E","F"," ","A","I","R","P","O","R","T"," "," "," "," "," "," "," "," "," "," "," "," "],
                        ["E","H","A","M"," "," ","N","5","2","o","1","8",".","5"," "," "," "," "," "," "," "," "," "," "],
                        [" "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "],
                        [" "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "],
                        [" ","\xEA","\xA1","\xA2","\xA3","\xA4"," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "],
                        [" "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "],
                        [" "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "],
                        [" "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "],
                        ["-","-","-","-","-","-","-","-","-","-","-","-","-","-","-","-","-","-","-","-","-","-","-","-"],
                        ["<","I","N","D","E","X"," "," "," "," "," "," "," "," "," ","P","O","S"," ","I","N","I","T",">"],
                        [" "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "],
                    ]

                    dataToSend = Buffer.alloc(dd.size)
                    let offset = 0
                    for (let x = 0; x < 24; x++) {
                        for (let y = 0; y < 14; y++) {

                            // Each character is 3 bytes: char, color, type
                            let charToWrite = cduScreen[y][x].charCodeAt(0)
                            const randColor = Math.floor(Math.random() * 6) // Random color from 0 to 5

                            dataToSend.writeUInt8(charToWrite, offset++);
                            dataToSend.writeUInt8(randColor, offset++); // color byte
                            dataToSend.writeUInt8(0, offset++); // type byte
                        }
                    }
                    dataToSend.writeUInt8(1, dd.size-1); // CDU powered
                } else if (dd.id === "PMDG_NG3_Data") {
                    dataToSend = Buffer.alloc(PMDG_NG3_Data_Size(), 0)
                    //
                    // let offset = 0;
                    // for (const d of PMDG_NG3_Data) {
                    //     const size = d.size || 1;
                    //     for (let i = 0; i < size; i++) {
                    //         if (offset >= dataToSend.length) {
                    //             console.warn(`PMDG_NG3_Data: Offset ${offset} exceeds data length ${dataToSend.length}`);
                    //             break;
                    //         }
                    //
                    //         let dataWrote = 0
                    //         switch (d.dataType) {
                    //             case DataDefinitionType.BOOLEAN:
                    //                 let randomBoolean = Math.random() < 0.5 ? 1 : 0; // Random boolean value
                    //                 dataToSend.writeUInt8(randomBoolean, offset);
                    //                 dataWrote = 1
                    //                 break;
                    //             case DataDefinitionType.CHAR:
                    //                 dataToSend.writeUInt8(0, offset);
                    //                 dataWrote = 1
                    //                 break;
                    //             case DataDefinitionType.FLOAT:
                    //                 dataToSend.writeFloatLE(0.0, offset);
                    //                 dataWrote = 4
                    //                 break;
                    //             case DataDefinitionType.UINT:
                    //                 dataToSend.writeUInt32LE(0, offset);
                    //                 dataWrote = 4
                    //                 break;
                    //             case DataDefinitionType.SHORT:
                    //                 dataToSend.writeInt16LE(0, offset);
                    //                 dataWrote = 2
                    //                 break;
                    //             default:
                    //                 throw new Error(`Unsupported PMDG_NG3_Data type: ${d.dataType}`);
                    //         }
                    //         offset += dataWrote;
                    //     }
                    // }
                } else {
                    return;
                }

                try {
                    dd.callback(dd, new RawBuffer(dataToSend));
                } catch (error) {
                    console.error(`Error in callback for descriptor ${dd.id}:`, error);
                }
            }
        }, 1000); // Keep the process alive
    }

    public async connect() {
        console.info("MockSim: SimConnect initialized successfully.");
        this.connected = true;
    }
    public async disconnect() {
        console.info("MockSim: SimConnect disconnected successfully.");
        this.connected = false;
    }
    public register(descriptor: Descriptor) {
        console.info("MockSim: Registering descriptor:", descriptor);
        this.descriptors.push(descriptor)
    }
    public trigger(id: string, value: number) {
        console.info(`MockSim: Triggering item '${id}' with value '${value}'.`);
    }
}