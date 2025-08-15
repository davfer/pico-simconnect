import {devices, HID} from "node-hid";
import {UsbDevice} from "@shared/usb.types.ts";
import {BoardInterface} from "@shared/board.types.ts";
import {BoardInterfaceChangeCallback} from "@electron/usb/device.ts";

export default abstract class Usb {
    protected device: HID | null = null;

    protected abstract pollDevice(): Promise<void>;

    public abstract trigger(id: string, value: number): Promise<BoardInterface>

    public abstract onChange(id: string, callback: BoardInterfaceChangeCallback) : void

    public abstract offChange(id: string) : void

    public abstract sendCmd(cmd: number, data: number[]) : Promise<number[]>

    private pollingId: NodeJS.Timeout | null = null;

    constructor(private vendorId: number, private productId: number, private pollingMs: number = 1000) {
    }

    public static list(): UsbDevice[] {
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
        this.pollingId = setInterval(async () => {
            if (!this.device) {
                console.warn('Device not opened, cannot poll')
                return
            }

            try {
                await this.pollDevice()
            } catch (error) {
                console.error('Error during polling:', error)
            }
        }, this.pollingMs);
    }
}