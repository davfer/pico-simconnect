import {
    ClientDataPeriod, ClientDataRequestFlag,
    EventFlag,
    open,
    Protocol,
    RecvEvent,
    SimConnectConnection,
    SimConnectConstants
} from "node-simconnect";
import {CduDescriptor, Descriptor, WriteDescriptor} from "@shared/sim.types.ts";

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

        if (descriptor.type === 'event') {
            // this.sim.addClientEventToNotificationGroup(
            //     SimConnectConstants.OBJECT_ID_USER,
            //     descriptor.hwid,
            //     descriptor.simid
            // );
        } else if (descriptor.type === 'cdu') {
            const cduDescriptor = descriptor as CduDescriptor;
            this.sim.mapClientDataNameToID(cduDescriptor.dataName, cduDescriptor.dataId);
            this.sim.addToClientDataDefinition(cduDescriptor.dataDefinition, 0, cduDescriptor.size);
            this.sim.requestClientData(
                cduDescriptor.dataId,
                cduDescriptor.simid,
                cduDescriptor.dataDefinition,
                ClientDataPeriod.ON_SET,
                ClientDataRequestFlag.CLIENT_DATA_REQUEST_FLAG_CHANGED
            );
        }else if (descriptor.type === 'write') {
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