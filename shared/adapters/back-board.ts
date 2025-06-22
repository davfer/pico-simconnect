import Board from "@electron/board";
import {InitBoardProps, TriggerBoardProps} from "@shared/adapters/ipc.types.ts";
import {BrowserWindow} from "electron";
import IpcMainInvokeEvent = Electron.IpcMainInvokeEvent;
import {ISim} from "@electron/simconnect/sim.types.ts";
import {Mocksim} from "@electron/simconnect/mocksim.ts";

export class BackBoard {
    private boards = new Map<string, Board>();
    // private sim: ISim = new Sim();
    private sim: ISim = new Mocksim();

    constructor(private ipc: Electron.IpcMain, private mainWindow: BrowserWindow) {
        console.info("BackBoard: Initializing...");

        this.ipc.handle('init-sim', async () => {
            console.info("BackBoard: Initializing SimConnect...");
            try {
                await this.sim.connect();
                console.info("BackBoard: SimConnect initialized successfully.");
                return {success: true};
            } catch (err) {
                console.error("BackBoard: Failed to initialize SimConnect:", err);
                return {success: false, error: err};
            }
        });

        this.ipc.handle('disconnect-sim', async () => {
            console.info("BackBoard: Disconnecting SimConnect...");
            try {
                await this.sim.disconnect();
                console.info("BackBoard: SimConnect disconnected successfully.");
                return {success: true};
            } catch (err) {
                console.error("BackBoard: Failed to disconnect SimConnect:", err);
                return {success: false, error: err};
            }
        });

        this.ipc.handle('init-board', async (_: IpcMainInvokeEvent, args: InitBoardProps) => {
            const {id, vendorId, productId, items} = args;
            if (this.boards.has(id)) {
                console.warn(`BackBoard: Board with id '${id}' already initialized.`);
                return {success: false, error: `Board with id '${id}' already initialized.`};
            }
            console.info(`BackBoard: Initializing board '${id}' (VID: ${vendorId}, PID: ${productId}, Items: ${items.length})`);
            const board = new Board(this.sim, vendorId, productId, items || []);
            try {
                await board.open();
                console.info(`BackBoard: Board '${id}' opened successfully.`);
            } catch (err) {
                console.error(`BackBoard: Failed to open board '${id}':`, err);
                return {success: false, error: `Failed to open board '${id}': ${err}`};
            }

            // attach frontend listeners
            for (const item of items) {
                board.onChange(item.id, (boardId, value) => { // boardId here is actually the board's main id from the constructor
                    console.info(`BackBoard: Board '${boardId}' triggered item '${item.id}' with value '${value}'`);
                    this.mainWindow.webContents.send('board-changed', boardId, item.id, value);
                })
            }

            this.boards.set(id, board);
            console.info(`BackBoard: Board '${id}' initialized and listening for changes.`);
            return {success: true};
        });

        this.ipc.handle('trigger-board', (_: IpcMainInvokeEvent, args: TriggerBoardProps) => {
            const {id, itemId, value} = args;
            const board = this.boards.get(id);
            if (!board) {
                console.warn(`BackBoard: Board with id '${id}' not found. Cannot trigger item '${itemId}'.`);
                return {success: false, error: `Board with id '${id}' not found. (${this.boards.size})`};
            }
            console.info(`BackBoard: Triggering item '${itemId}' on board '${id}' with value '${value}'.`);
            board.trigger(itemId, value);
            return {success: true};
        });

        this.ipc.handle('unregister-board', async (_: IpcMainInvokeEvent, {id}: { id: string }) => {
            console.info(`BackBoard: Unregistering board with id '${id}'...`);
            const board = this.boards.get(id);
            if (!board) {
                console.warn(`BackBoard: Board with id '${id}' not found for unregistration.`);
                return {success: false, error: `Board with id '${id}' not found.`};
            }
            try {
                await board.close();
                this.boards.delete(id);
                console.info(`BackBoard: Board '${id}' unregistered successfully.`);
                return {success: true};
            } catch (err) {
                console.error(`BackBoard: Failed to unregister board '${id}':`, err);
                return {success: false, error: `Failed to unregister board '${id}': ${err}`};
            }
        });
    }

    async close() {
        console.info("BackBoard: Closing all boards...");
        for (const [id, board] of this.boards) {
            try {
                await board.close();
                console.info(`BackBoard: Board '${id}' closed successfully.`);
            } catch (err) {
                console.error(`BackBoard: Failed to close board '${id}':`, err);
            }
        }
        this.boards.clear();
        console.info("BackBoard: All boards closed.");

        if (this.sim) {
            console.info("BackBoard: Disconnecting SimConnect...");
            await this.sim.disconnect();
            console.info("BackBoard: SimConnect disconnected.");
        } else {
            console.info("BackBoard: SimConnect already disconnected.");
        }
    }
}