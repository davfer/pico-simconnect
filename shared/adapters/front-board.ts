import {BoardItem} from "@shared/board.types.ts";
import {GenericResponse, InitBoardProps, TriggerBoardProps} from "@shared/adapters/ipc.types.ts";

// FrontBoard
export default class FrontBoard {

    constructor(private readonly ipcRenderer: Electron.IpcRenderer) {
        console.info("FrontBoard: Initializing...");
    }


    async connectToSimulator() {
        console.info("FrontBoard: connectToSimulator called.");
        const res = await this.ipcRenderer.invoke('init-sim', {})
        if (!res || !res.success) {
            const errorMsg = `Failed to connect to simulator: ${res?.error || 'Unknown error'}`;
            console.error(`FrontBoard: ${errorMsg}`);
            throw new Error(errorMsg);
        }
        console.info("FrontBoard: Simulator connection established.");
    }

    async disconnectFromSimulator() {
        console.info("FrontBoard: disconnectFromSimulator called.");
        const res = await this.ipcRenderer.invoke('disconnect-sim', {})
        if (!res || !res.success) {
            const errorMsg = `Failed to disconnect from simulator: ${res?.error || 'Unknown error'}`;
            console.error(`FrontBoard: ${errorMsg}`);
            throw new Error(errorMsg);
        }
        console.info("FrontBoard: Simulator disconnected successfully.");
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
            const errorMsg = `Failed to register board '${id}': ${res?.error || 'Unknown error'}`
            console.error(`FrontBoard: ${errorMsg}`);
            throw new Error(errorMsg);
        }
        console.info(`FrontBoard: Board '${id}' registered successfully.`)
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

    onChange(boardId: string, callback: (itemId: string, value: any) => void) {
        console.info(`FrontBoard: Registering change listener for board '${boardId}'...`);
        this.ipcRenderer.on('board-changed', (_event, {id, itemId, value}) => {
            //console.trace(`FrontBoard: Item '${itemId}' on board '${boardId}' changed with value '${value}'.`);
            if (id === boardId) {
                callback(itemId, value);
            }
        });
        // It might be useful to return a function to unregister the listener
        // For now, keeping it simple as per original structure
    }

    async triggerItem(boardId: string, itemId: string, value: number) {
        //console.trace(`FrontBoard: Triggering item '${itemId}' on board '${boardId}' with value '${value}'...`);
        const req: TriggerBoardProps = {
            id: boardId,
            itemId: itemId,
            value: value
        }
        const res = await this.ipcRenderer.invoke('trigger-board', req) as GenericResponse;
        if (!res || !res.success) {
            console.error("FrontBoard: Failed to trigger item:", res.error);
            throw new Error(`Failed to trigger item: ${res.error}`);
        }
        console.trace(`FrontBoard: Item '${itemId}' on board '${boardId}' trigger sent.`);
    }
}