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

        this.sim.on('clientData', recvSimObjectData => {
            const def = this.definitions.find(d => d.simid === recvSimObjectData.requestID && d.type === 'data') as DataDescriptor
            //console.log(`Received client data for ${def?.id}:`, recvSimObjectData.requestID, recvSimObjectData.defineCount, recvSimObjectData.entryNumber);
            if (!def || !def.callback) {
                console.error(`Received data with untracked ID: ${recvSimObjectData.requestID}`);
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

        console.log(`Subscribing to definition: ${descriptor.id}`, descriptor);
        if (descriptor.type === 'data') {
            const dDescriptor = descriptor as DataDescriptor;
            this.sim.mapClientDataNameToID(dDescriptor.dataName, dDescriptor.dataId);
            this.sim.addToClientDataDefinition(dDescriptor.dataDefinition, 0, dDescriptor.size);
            this.sim.requestClientData(
                dDescriptor.dataId,
                dDescriptor.simid,
                dDescriptor.dataDefinition,
                (dDescriptor.dataUpdateOnChange === true || dDescriptor.dataUpdateOnChange === null) ? ClientDataPeriod.ON_SET : ClientDataPeriod.SECOND,
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