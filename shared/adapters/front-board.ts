import {BoardItem} from "@shared/board.types.ts";
import {GenericResponse, InitBoardProps, TriggerBoardProps} from "@shared/adapters/ipc.types.ts";

// FrontBoard
export default class FrontBoard {

    constructor(private readonly ipcRenderer: Electron.IpcRenderer) {
        console.info("FrontBoard: Initializing...");
    }


    connectToSimulator() {
        // TODO: Implement simulator connection logic
        console.info("FrontBoard: connectToSimulator called (not implemented).");
    }


    async registerBoard(id: string, vid: number, pid: number, items: BoardItem[]) {
        console.info(`FrontBoard: Registering board '${id}' (VID: ${vid}, PID: ${pid}, Items: ${items.length})`);
        const res = await this.ipcRenderer.invoke('init-board', {
            id: id,
            productId: pid,
            vendorId: vid,
            items: items,
        } as InitBoardProps)
        console.info(`FrontBoard: Board registration response for '${id}':`, res);
        if (!res || !res.success) {
            const errorMsg = `Failed to register board '${id}': ${res?.error || 'Unknown error'}`;
            console.error(`FrontBoard: ${errorMsg}`);
            throw new Error(errorMsg);
        }
        console.info(`FrontBoard: Board '${id}' registered successfully.`);
    }

    async unregisterBoard(id: string) {
        console.info(`FrontBoard: Unregistering board '${id}'...`);
        const res = await this.ipcRenderer.invoke('unregister-board', {id: id}) as GenericResponse;
        if (!res || !res.success) {
            const errorMsg = `Failed to unregister board '${id}': ${res?.error || 'Unknown error'}`;
            console.error(`FrontBoard: ${errorMsg}`);
            throw new Error(errorMsg);
        }
        console.info(`FrontBoard: Board '${id}' unregistered successfully.`);
    }

    onChange(boardId: string, callback: (itemId: string, value: number) => void) {
        console.info(`FrontBoard: Registering change listener for board '${boardId}'...`);
        this.ipcRenderer.on('board-changed', (_event, eventBoardId, itemId, value) => {
            if (eventBoardId === boardId) {
                console.info(`FrontBoard: Item '${itemId}' on board '${boardId}' changed with value '${value}'.`);
                callback(itemId, value);
            }
        });
        // It might be useful to return a function to unregister the listener
        // For now, keeping it simple as per original structure
    }

    async triggerItem(boardId: string, itemId: string, value: number) {
        console.info(`FrontBoard: Triggering item '${itemId}' on board '${boardId}' with value '${value}'...`);
        const req: TriggerBoardProps = {
            id: boardId,
            itemId: itemId,
            value: value
        }
        // Note: 'trigger-board' in BackBoard is ipc.on, not ipc.handle, so it doesn't return a response.
        // If a response is needed, BackBoard should be changed to use ipc.handle.
        // For now, assuming no direct response is expected or processed from this specific trigger.
        this.ipcRenderer.send('trigger-board', req);
        // Original code used invoke, which implies a response. If 'trigger-board' is meant to be fire-and-forget,
        // then send is more appropriate. If a response was actually expected, then BackBoard needs adjustment.
        // For now, I've changed it to 'send' to match BackBoard's 'ipc.on'.
        // The original code had:
        // const res = await this.ipcRenderer.invoke('trigger-board', req) as GenericResponse;
        // if (!res || !res.success) {
        //     console.error("FrontBoard: Failed to trigger item:", res.error);
        //     throw new Error(`Failed to trigger item: ${res.error}`);
        // }
        console.info(`FrontBoard: Item '${itemId}' on board '${boardId}' trigger sent.`);
    }
}