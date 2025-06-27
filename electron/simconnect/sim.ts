import {
    ClientDataPeriod,
    ClientDataRequestFlag,
    EventFlag,
    open,
    Protocol,
    RecvEvent,
    SimConnectConnection,
    SimConnectConstants
} from "node-simconnect";
import {DataDescriptor, Descriptor, WriteDescriptor} from "@shared/sim.types.ts";

const EVENT_ID_PAUSE = 1;

export class Sim {
    private sim?: SimConnectConnection = undefined;
    private definitions: Descriptor[] = [];

    constructor() {
        // Initialization if needed
    }

    public async connect() {
        try {
            const {handle, recvOpen} = await open('My SimConnect client', Protocol.FSX_SP2)
            this.sim = handle
            console.log('Connected to', recvOpen.applicationName);
            for (const def of this.definitions) {
                this.subscribeToSim(def)
            }
            console.log('SimConnect subscribed to all definitions:', this.definitions.length);
        } catch (error) {
            console.error('Failed to connect to SimConnect:', error);
            throw error;
        }

        this.sim.on('event', (recvEvent: RecvEvent) => {
            switch (recvEvent.clientEventId) {
                case EVENT_ID_PAUSE:
                    console.log(recvEvent.data === 1 ? 'Sim paused' : 'Sim unpaused');
                    break;
            }

            const def = this.definitions.find(d => d.simid === recvEvent.clientEventId);
            if (!def || !def.callback) {
                console.debug(`Received event with untracked ID: ${recvEvent.clientEventId}`);
                return
            }
            try {
                def.callback(def, recvEvent.data);
            } catch (error) {
                // not our problem
            }
        });
        // this.sim.on('simObjectData', (recvSimObjectData:RecvSimObjectData) => {
        //     console.log("Received sim object data:", recvSimObjectData);
        //     const def = this.definitions.find(d => d.simid === recvSimObjectData.requestID);
        //     if (!def) {
        //         console.debug(`Received data with untracked definition: ${recvSimObjectData.requestID}`);
        //         return;
        //     }
        //     if (def.type != 'data') {
        //         console.warn(`Received data for non-data definition: ${def.id}`);
        //         return;
        //     }
        //
        //     function parseDataDefinition(def: DataDefinition, recvSimObjectData: RecvSimObjectData) : any {
        //         switch (def.dataType) {
        //             case SimConnectDataType.STRING8:
        //                 return recvSimObjectData.data.readString8()
        //             case SimConnectDataType.STRING32:
        //                 return recvSimObjectData.data.readString32()
        //             case SimConnectDataType.INT32:
        //                 return recvSimObjectData.data.readInt32()
        //             case SimConnectDataType.FLOAT32:
        //                 return recvSimObjectData.data.readFloat32()
        //             default:
        //                 console.warn(`Unsupported data type: ${def.dataType}`);
        //                 return null;
        //         }
        //     }
        //
        //     const result = new Map<string, any>()
        //     const dDef = def as DataDefinitionDescriptor;
        //     for (const data of dDef.definitions) {
        //         const size = data.size || 1;
        //         let values = [];
        //         for (let i = 0; i < size; i++) {
        //             const value = parseDataDefinition(data, recvSimObjectData);
        //             if (value !== null) {
        //                 values.push(value);
        //             }
        //         }
        //         result.set(data.name, values.length === 1 ? values[0] : values)
        //     }
        //
        //     try {
        //         if (dDef.callback) {
        //             dDef.callback(dDef, result)
        //         }
        //     } catch (error) {
        //         // not our problem
        //     }
        //
        //     // find "read" definitions subscribed to the same simid
        //     const readDefs : ReadDescriptor[] = this.definitions.filter(d => d.type === 'read' && d.simid === def.simid) as ReadDescriptor[]
        //     for (const readDef of readDefs) {
        //         if (readDef.callback) {
        //             try {
        //                 readDef.callback(readDef, result.get(readDef.name));
        //             } catch (error) {
        //                 // not our problem
        //             }
        //         } else {
        //             console.warn(`No callback defined for read definition: ${readDef.id}`);
        //         }
        //     }
        // })
        this.sim.on('clientData', recvSimObjectData => {
            const def = this.definitions.find(d => d.simid === recvSimObjectData.requestID && d.type === 'data') as DataDescriptor
            console.log(`Received client data for ${def?.id}:`, recvSimObjectData.requestID, recvSimObjectData.defineCount, recvSimObjectData.entryNumber);
            if (!def || !def.callback) {
                console.error(`Received data with untracked ID: ${recvSimObjectData.requestID}`);
                return;
            }


            // const CDU_COLUMNS = 24;
            // const CDU_ROWS = 14;
            // const screenText: string[] = Array(CDU_ROWS).fill('');
            //
            // for (let col = 0; col < CDU_COLUMNS; col++) {
            //     for (let row = 0; row < CDU_ROWS; row++) {
            //         const offset = (row * CDU_COLUMNS + col) * 3; // Each character is 3 bytes: char, color, flags
            //         // I tried readString(1) but that only works with zero-terminated strings, which doesn't seem to be used here
            //         const symbol = recvSimObjectData.data.readBytes(1).toString("utf-8") // I tried readString(1) but that only works with zero-terminated strings, which doesn't seem to be used here
            //         const color = recvSimObjectData.data.readBytes(1)[0]
            //         const flags = recvSimObjectData.data.readBytes(1)[0]
            //
            //         screenText[row] += symbol;
            //     }
            // }
            // const cduPowered = recvSimObjectData.data.readBytes(1)[0] === 1
            // console.log("So...", screenText, cduPowered);
            //

            try {
                def.callback(def, recvSimObjectData.data);
            } catch (error) {
                // not our problem
            }
        });
        this.sim.on('exception', function (recvException) {
            console.log(recvException);
        });

        this.sim.on('quit', () => {
            console.log('The simulator quit.');
            if (!this.sim) {
                return;
            }
            this.sim.close();
            this.sim = undefined;
        });
        this.sim.on('close', () => {
            console.log('Connection closed unexpectedly.');
            if (!this.sim) {
                return;
            }
            this.sim.close();
            this.sim = undefined;
        });

        this.sim.subscribeToSystemEvent(EVENT_ID_PAUSE, 'Pause');
    }

    public async disconnect() {
        if (!this.sim) {
            console.warn('SimConnect is not connected');
            return;
        }
        try {
            this.sim.close();
            this.sim = undefined;
            console.log('SimConnect disconnected successfully');
        } catch (error) {
            console.error('Failed to disconnect SimConnect:', error);
        }
    }

    public register(descriptor: Descriptor) {
        console.log("registering descriptor:", descriptor);
        if (this.definitions.some(d => d.id === descriptor.id)) {
            throw new Error(`Watcher with ID ${descriptor.id} already registered`);
        }
        this.definitions.push(descriptor);

        if (this.sim) {
            this.subscribeToSim(descriptor);
        }
    }

    public trigger(id: string, value: number) {
        if (!this.sim) {
            throw new Error('SimConnect not connected');
        }

        const def = this.definitions.find(d => d.id === id && d.type == "write") as WriteDescriptor
        if (!def) {
            throw new Error(`No definition found for ID: ${id}`);
        }

        console.log(`Triggering SIM for ${def.id} to ${def.hwid} with value:`, value);
        // const dataToSet = new RawBuffer(0);
        // dataToSet.clear();
        // dataToSet.writeInt32(def.hwid)
        // dataToSet.writeInt32(value)
        // this.sim.setClientData(def.dataId, def.dataDefinition, 0, 0, 64, dataToSet.getBuffer()) // 64 bits

        this.sim.transmitClientEvent(
            SimConnectConstants.OBJECT_ID_USER,
            def.simid,
            value,
            1,
            EventFlag.EVENT_FLAG_GROUPID_IS_PRIORITY
        );
    }

    private subscribeToSim(descriptor: Descriptor) {
        if (!this.sim) {
            throw new Error('SimConnect not connected');
        }

        /*if (descriptor.type === 'event') {
            // this.sim.addClientEventToNotificationGroup(
            //     SimConnectConstants.OBJECT_ID_USER,
            //     descriptor.hwid,
            //     descriptor.simid
            // );
            // this.sim.addToDataDefinition(
            //
            // )
        }else */
        /*if (descriptor.type === 'data') { // data definition
            const ddDescriptor = descriptor as DataDefinitionDescriptor;
            for (const def of ddDescriptor.definitions) {
                this.sim.addToDataDefinition(
                    ddDescriptor.defid,
                    def.name,
                    def.unit,
                    def.dataType
                );
            }
            this.sim.requestDataOnSimObject(
                ddDescriptor.simid,
                ddDescriptor.defid,
                SimConnectConstants.OBJECT_ID_USER,
                SimConnectPeriod.SIM_FRAME
            );
        } else */
        console.log(`Subscribing to definition: ${descriptor.id}`, descriptor);
        if (descriptor.type === 'data') {
            const dDescriptor = descriptor as DataDescriptor;
            this.sim.mapClientDataNameToID(dDescriptor.dataName, dDescriptor.dataId);
            this.sim.addToClientDataDefinition(dDescriptor.dataDefinition, 0, dDescriptor.size);
            this.sim.requestClientData(
                dDescriptor.dataId,
                dDescriptor.simid,
                dDescriptor.dataDefinition,
                ClientDataPeriod.ON_SET,
                ClientDataRequestFlag.CLIENT_DATA_REQUEST_FLAG_CHANGED
            );
        } else if (descriptor.type === 'write') {
            const wDescriptor = descriptor as WriteDescriptor;
            this.sim.mapClientEventToSimEvent(
                wDescriptor.simid,
                '#' + wDescriptor.hwid,
            );

            // this.sim.mapClientDataNameToID(wDescriptor.dataName, wDescriptor.dataId)
            // this.sim.addToClientDataDefinition(wDescriptor.dataDefinition, 0, 64, 0, 0) // 64 bits
        } else if (descriptor.type === 'read') {
            // noop
        } else {
            throw new Error(`Unknown descriptor type: ${descriptor.type}`);
        }
        //
        // this.definitions.push(descriptor)
    }
}