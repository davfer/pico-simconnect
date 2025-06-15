import {BoardItem} from "@shared/board.types.ts";
import {GenericResponse, InitBoardProps, TriggerBoardProps} from "@shared/adapters/ipc.types.ts";

// FrontBoard
export default class FrontBoard {

    constructor(private readonly ipcRenderer: Electron.IpcRenderer) {

    }


    connectToSimulator() {

    }


    async registerBoard(id: string, vid: number, pid: number, items: BoardItem[]) {
        const res = await this.ipcRenderer.invoke('init-board', {
            id: id,
            productId: pid,
            vendorId: vid,
            items: items,
        } as InitBoardProps)
        console.info("Registering board response:", res);
        if (!res || !res.success) {
            console.error("Failed to register board:", res.error);
            throw new Error(`Failed to register board: ${res.error}`);
        }
    }

    async unregisterBoard(id: string) {
        // Unregister the board with the given id
        // This could involve removing it from a list or stopping any polling
        console.info(`Unregistering board with id: ${id}`);
        const res = await this.ipcRenderer.invoke('unregister-board', {id: id}) as GenericResponse;
        if (!res || !res.success) {
            console.error("Failed to unregister board:", res.error);
            throw new Error(`Failed to unregister board: ${res.error}`);
        }
    }

    async onChange(id: string, callback: (id: string, value: number) => void) {
        // Register a callback for changes on the specified item
        console.info(`Registering change listener for item ${id}`);
        this.ipcRenderer.on('board-changed', (_, boardId, itemId, value) => {
            if (boardId === id) {
                console.info(`Item ${itemId} changed with value ${value}`);
                callback(itemId, value);
            }
        });
    }

    async triggerItem(id: string, itemId: string, value: number) {
        // Trigger an item on the board with the given id and value
        console.info(`Triggering item ${itemId} on board ${id} with value ${value}`);
        const req: TriggerBoardProps = {
            id: id,
            itemId: itemId,
            value: value
        }
        const res = await this.ipcRenderer.invoke('trigger-board', req) as GenericResponse;
        if (!res || !res.success) {
            console.error("Failed to trigger item:", res.error);
            throw new Error(`Failed to trigger item: ${res.error}`);
        }
    }
}