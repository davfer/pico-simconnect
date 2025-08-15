import {BoardInterface, BoardInterfaceValue} from "@shared/board.types.ts";
import Usb from "@electron/usb/usb.ts";
import {BUTTONS_REPORT} from "@src/features/pap3n/pap3n.layout.ts";

export const WINWING_PAP3N_OFFSETS : Record<number, string> = {

}

export default class Winwing extends Usb {
    private listeners = new Map<string, (value: BoardInterfaceValue) => void>();

    constructor(vendorId: number, productId: number, private readonly interfaces: BoardInterface[], pollingMs: number = 1000) {
        super(vendorId, productId, pollingMs)
    }

    protected async pollDevice() {
        try {
            const data = this.device!.getFeatureReport(BUTTONS_REPORT, 32);
            console.log(`Winwing: Read data: ${data}`);

            const parsedData = this.parseData(data);
            for (const iface of this.interfaces) {
                if (iface.type === 'button') {
                    const buttonData = parsedData.find(d => d.id === iface.id);
                    if (buttonData) {
                        const callback = this.listeners.get(iface.id);
                        if (callback) {
                            callback(buttonData.value);
                        }
                    }
                }
            }
        } catch (error) {
            console.error('Error reading from device:', error);
        }
    }

    private parseData(data: number[]): BoardInterface[] {
        // Get 32-bit button report fields (Little Endian)
        const ButtonState  = (data[0]       | (data[1] << 8)  | (data[2] << 16) | (data[3] << 24)) >>> 0;
        const ButtonState2 = (data[4]       | (data[5] << 8)  | (data[6] << 16) | (data[7] << 24)) >>> 0;
        const ButtonState3 = (data[8]       | (data[9] << 8)  | (data[10] << 16) | (data[11] << 24)) >>> 0;
        console.log("Buttons State:", {
            ButtonState,
            ButtonState2,
            ButtonState3
        })

        // Get 16-bit encoder values (Little Endian)
        const CourseLeftEncoderValue   = (data[20] | (data[21] << 8)) & 0xFFFF;
        const SpdEncoderValue          = (data[22] | (data[23] << 8)) & 0xFFFF;
        const HdgEncoderValue          = (data[24] | (data[25] << 8)) & 0xFFFF;
        const AltEncoderValue          = (data[26] | (data[27] << 8)) & 0xFFFF;
        const VsEncoderValue           = (data[28] | (data[29] << 8)) & 0xFFFF;
        const CourseRightEncoderValue = (data[30] | (data[31] << 8)) & 0xFFFF;
        console.log("Encoders Values:", {
            CourseLeftEncoderValue,
            SpdEncoderValue,
            HdgEncoderValue,
            AltEncoderValue,
            VsEncoderValue,
            CourseRightEncoderValue
        })


        return []
    }
}