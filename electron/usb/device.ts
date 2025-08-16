import {devices, HID} from 'node-hid'
import {
    BoardButton,
    BoardInterface,
    BoardInterfaceType,
    BoardInterfaceValue,
    BoardLed
} from "../../shared/board.types.ts";
import {UsbDevice} from "../../shared/usb.types.ts";

const CMD_TRIGGER_PIN = 0x03;
const CMD_READ_PINS_MASKED = 0x05;

export type BoardInterfaceChangeCallback = (value: BoardInterfaceValue) => void

export default class Device {
    private device: HID | null = null;
    private listeners = new Map<string, (value: BoardInterfaceValue) => void>();
    private pollingId: NodeJS.Timeout | null = null;

    constructor(private vendorId: number, private productId: number, private interfaces: BoardInterface[], private pollingMs: number = 1000) {
    }

    static list(): UsbDevice[] {
        return devices().map(device => {
            return {
                vid: device.vendorId,
                pid: device.productId,
                product: device.product || 'Unknown Device'
            }
        })
    }

    public async open() {
        if (this.device) {
            console.warn(`Device already opened: ${this.vendorId}:${this.productId}`);
            return;
        }
        if (this.vendorId === 0 || this.productId === 0) {
            throw new Error(`Invalid vendorId or productId: ${this.vendorId}:${this.productId}`);
        }
        try {
            this.device = new HID(this.vendorId, this.productId);
            console.log(`Device opened: ${this.vendorId}:${this.productId}`);
        } catch (error) {
            console.error(`Failed to open device ${this.vendorId}:${this.productId}`, error);
            throw error;
        }

        if (this.pollingMs >= 0) {
            await this.startPolling();
        }
    }

    async trigger(id: string, value: number): Promise<BoardInterface> {
        if (!this.device) {
            throw new Error('Device not opened');
        }

        const iface = this.interfaces.find(i => i?.id === id);
        if (!iface) {
            throw new Error(`Interface with id ${id} not found`);
        }

        if (iface?.type !== BoardInterfaceType.LED) {
            throw new Error(`Interface with id ${id} is not a LED`);
        }

        const led = iface as BoardLed;
        if (led?.offset === undefined) {
            throw new Error(`LED with id ${id} does not have an offset defined`);
        }
        await this.sendCmd(CMD_TRIGGER_PIN, [led?.offset, value !== 0 ? 1 : 0]);

        return iface
    }

    onChange(id: string, callback: BoardInterfaceChangeCallback) {
        if (this.listeners.has(id)) {
            console.warn(`Listener for ${id} already exists`);
            return;
        }

        this.listeners.set(id, callback);
    }

    offChange(id: string) {
        if (!this.listeners.has(id)) {
            console.warn(`No listener for ${id} found`);
            return;
        }

        this.listeners.delete(id);
    }

    async close() {
        if (this.device) {
            this.device.close();
            this.device = null;
            this.pollingId?.close()
            console.log(`Device closed: ${this.vendorId}:${this.productId}`);
        }
    }

    private async startPolling() {
        // Start polling logic here if needed
        console.info('start polling...')
        this.pollingId = setInterval(async () => {
            if (!this.device) {
                console.warn('Device not opened, cannot poll');
                return
            }

            try {
                const response = await this.sendCmd(CMD_READ_PINS_MASKED, []);
                console.trace('Response reading pins:', response);
                await this.parsePollingResponse(response)
            } catch (error) {
                console.error('Error during polling:', error); // TODO
            }
        }, this.pollingMs);
    }

    private async parsePollingResponse(response: number[]) {
        if (response.length < 1) {
            console.warn('Empty response received');
            return;
        }

        // Process the response data (every byte is 8 bits, every bit is a pin state)
        for (let i = 0; i < response.length; i++) {
            const inputBlockOffset = i * 8; // Each byte represents 8 pins
            for (let bit = 0; bit < 8; bit++) {
                const pinOffset = inputBlockOffset + bit;
                const pinValue = (response[i] >> bit) & 1;

                if (pinValue === 1) {
                    console.info(`Pin ${pinOffset} is HIGH`);
                }

                const iface = this.interfaces.filter(i => i?.type === BoardInterfaceType.BUTTON).find(i => (i as BoardButton)?.offset === pinOffset) as BoardButton | undefined;
                if (!iface) {
                    continue
                }

                if (iface?.value?.value != pinValue) {
                    const listener = this.listeners.get(iface.id);
                    if (!listener) {
                        continue;
                    }

                    const value: BoardInterfaceValue = {
                        value: pinValue,
                        lastValueChange: new Date(),
                        previousValue: iface?.value?.value
                    };
                    iface.value = value;

                    try {
                        listener(value);
                    } catch (error) {
                        // not our problem
                    }
                }
            }
        }
    }

    public async sendCmd(cmd: number, data: number[]) {
        if (!this.device) {
            throw new Error('Device not opened');
        }
        this.device.write([cmd, ...data]);
        console.log(`Command ${cmd} sent with data:`, JSON.stringify([cmd, ...data]));

        const res = this.device.readSync();
        if (!res.length || res[0] !== 0) {
            throw new Error('liaf');
        }

        return res.slice(1)
    }
}