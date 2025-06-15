import {EventFlag, open, Protocol, RecvEvent, SimConnectConnection, SimConnectConstants} from "node-simconnect";
import {Descriptor} from "@shared/sim.types.ts";

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

            const def = this.definitions.find(d => d.hwid === recvEvent.clientEventId);
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
        this.sim.on('clientData', recvSimObjectData => {
            console.log("Received client data:", recvSimObjectData);
            const def = this.definitions.find(d => d.hwid === recvSimObjectData.requestID);
            if (!def || !def.callback) {
                console.debug(`Received data with untracked ID: ${recvSimObjectData.requestID}`);
                return;
            }
            try {
                def.callback(def, recvSimObjectData.data);
            } catch (error) {
                // not our problem
            }
            // TODO: FMC
            // if (recvSimObjectData.requestID === RequestID.CDU_SCREEN_DATA_REQUEST) {
            //     const { powered, lines } = extractCduScreenState(recvSimObjectData.data);
            //     if (powered) {
            //         console.log(lines.join('\r\n'));
            //     } else {
            //         console.log('Not powered');
            //     }
            // }
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
        if (this.definitions.some(d => d.swid === descriptor.swid)) {
            throw new Error(`Watcher with ID ${descriptor.swid} already registered`);
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

        const def = this.definitions.find(d => d.swid === id);
        if (!def) {
            throw new Error(`No definition found for ID: ${id}`);
        }

        this.sim.transmitClientEvent(
            SimConnectConstants.OBJECT_ID_USER,
            def.hwid,
            value,
            0,
            EventFlag.EVENT_FLAG_GROUPID_IS_PRIORITY
        );
    }

    private subscribeToSim(_: Descriptor) {
        if (!this.sim) {
            throw new Error('SimConnect not connected');
        }

        // if (descriptor.type === 'event') {
        //     this.sim.addClientEventToNotificationGroup(
        //         SimConnectConstants.OBJECT_ID_USER,
        //         descriptor.hwid,
        //         descriptor.swid
        //     );
        // } else if (descriptor.type === 'data') {
        //     this.sim.requestClientData(
        //         SimConnectConstants.OBJECT_ID_USER,
        //         descriptor.hwid,
        //         descriptor.swid,
        //         0, // Flags
        //         0 // Request ID
        //     );
        // } else {
        //     throw new Error(`Unknown descriptor type: ${descriptor.type}`);
        // }
    }
}