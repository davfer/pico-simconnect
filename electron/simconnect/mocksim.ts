import {DataDescriptor, Descriptor} from "@shared/sim.types.ts";

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
                    let cduScreen = [
                        " "," "," "," "," "," "," "," ","I","D","E","N","T"," "," "," "," "," "," "," "," ","1","/","2",
                        " ","M","O","D","E","L"," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," ",
                        "7","3","7","-","8","0","0","W"," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," ",
                        " "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," ",
                        " "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," ",
                        " "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," ",
                        " "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," ",
                        " "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," ",
                        " "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," ",
                        " "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," ",
                        " "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," ",
                        " "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," ",
                        "<","I","N","D","E","X"," "," "," "," "," "," "," "," "," ","P","O","S"," ","I","N","I","T",">",
                        " "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," ",
                    ]

                    dataToSend = Buffer.alloc(dd.size)
                    for (let i = 0; i < cduScreen.length; i++) {
                        // Each character is 3 bytes: char, color, type
                        dataToSend.writeUInt8(cduScreen[i].charCodeAt(0), i * 3);
                        dataToSend.writeUInt8(0, i * 3 + 1); // color byte
                        dataToSend.writeUInt8(0, i * 3 + 2); // type byte
                    }
                    dataToSend.writeUInt8(1, dd.size-1); // CDU powered
                } else if (dd.id === "PMDG_NG3_Data") {
                    dataToSend = Buffer.alloc(256, 0)
                    dataToSend.writeInt8(2, 0);
                    dataToSend.writeInt8(1, 1);
                    dataToSend.writeInt8(0, 2);
                    dataToSend.writeInt8(1, 3);
                } else {
                    return;
                }

                try {
                    dd.callback(dd, dataToSend);
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