import {BoardButton, BoardInterface, BoardInterfaceType, BoardInterfaceValue, BoardLed} from "@shared/board.types.ts";
import Usb from "@electron/usb/usb.ts";

const CMD_TRIGGER_PIN = 0x03;
const CMD_READ_PINS_MASKED = 0x05;

export type BoardInterfaceChangeCallback = (value: BoardInterfaceValue) => void

export default class Device extends Usb {
    private listeners = new Map<string, (value: BoardInterfaceValue) => void>();

    constructor(vendorId: number, productId: number, private readonly interfaces: BoardInterface[], pollingMs: number = 1000) {
        super(vendorId, productId, pollingMs);
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

        // Example command to send to the device
        const cmd = CMD_TRIGGER_PIN; // Example command for triggering a button
        const data = [led?.offset, value !== 0 ? 1 : 0]; // Example data format

        await this.sendCmd(cmd, data);

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

    protected async pollDevice() {
        try {
            const response = await this.sendCmd(CMD_READ_PINS_MASKED, []);
            //console.trace('Response reading pins:', response);
            await this.parsePollingResponse(response)
        } catch (error) {
            // console.error('Error during polling:', error); // TODO
        }
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
        //log.log(`Command ${cmd} sent with data:`, data);

        const res = this.device.readSync();
        if (!res.length || res[0] !== 0) {
            throw new Error('liaf');
        }

        return res.slice(1)
    }
}