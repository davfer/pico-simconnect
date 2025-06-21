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
            console.log("Received client data:", recvSimObjectData);
            const def = this.definitions.find(d => d.simid === recvSimObjectData.requestID);
            if (!def || !def.callback) {
                console.debug(`Received data with untracked ID: ${recvSimObjectData.requestID}`);
                return;
            }
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

        const def = this.definitions.find(d => d.id === id);
        if (!def) {
            throw new Error(`No definition found for ID: ${id}`);
        }

        this.sim.transmitClientEvent(
            SimConnectConstants.OBJECT_ID_USER,
            def.simid,
            value,
            0,
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
            const writeDescriptor = descriptor as WriteDescriptor;
            this.sim.mapClientEventToSimEvent(
                descriptor.simid,
                '#' + writeDescriptor.hwid,
            );
        } else {
            throw new Error(`Unknown descriptor type: ${descriptor.type}`);
        }

        this.definitions.push(descriptor)
    }
}