import Board from "@electron/board";
import {InitBoardProps, TriggerBoardProps} from "@shared/adapters/ipc.types.ts";
import {Sim} from "@electron/simconnect/sim.ts";
import {BrowserWindow} from "electron";
import IpcMainInvokeEvent = Electron.IpcMainInvokeEvent;

export class BackBoard {
    private boards = new Map<string, Board>();
    private sim: Sim = new Sim();

    constructor(private ipc: Electron.IpcMain, private mainWindow: BrowserWindow) {
        console.log("Starting back board...");

        this.ipc.handle('init-sim', async () => {
            console.info("Initializing SimConnect...");
            return this.sim.connect().then(() => {
                console.info("SimConnect initialized successfully.");
                return {success: true};
            }).catch(err => {
                console.error("Failed to initialize SimConnect:", err);
                return {success: false, error: err.message};
            });
        });

        this.ipc.handle('init-board', (_: IpcMainInvokeEvent, args: InitBoardProps) => {
            const {id, vendorId, productId, items} = args
            if (this.boards.has(id)) {
                console.warn(`Board with id ${id} already exists.`);
                return {success: false, error: `Board with id ${id} already exists.`};
            }
            console.info('Starting board with id:', id, 'vid:', vendorId, 'pid:', productId, 'items:', items.length);
            const board = new Board(this.sim, vendorId, productId, items || []);
            board.open().then(() => {
                console.info(`Board ${id} opened successfully.`);
            }).catch(err => {
                console.error(`Failed to open board ${id}:`, err);
            });

            // attach frontend listeners
            for (const item of items) {
                board.onChange(item.id, (id, value) => {
                    console.info(`Board ${id} triggered item ${item.id} with value ${value}`);
                    this.mainWindow.webContents.send('board-changed', id, item.id, value);
                })
            }

            this.boards.set(id, board);

            return {success: true}
        })
        ipc.on('trigger-board', (_: IpcMainInvokeEvent, args: TriggerBoardProps) => {
            const {id, itemId, value} = args;
            const board = this.boards.get(id);
            if (!board) {
                console.warn(`Board with id ${id} not found.`);
                return;
            }
            board.trigger(itemId, value);
        });
    }

    async close() {
        console.info("Closing all boards...");
        for (const [id, board] of this.boards) {
            try {
                await board.close();
                console.info(`Board ${id} closed successfully.`);
            } catch (err) {
                console.error(`Failed to close board ${id}:`, err);
            }
        }
        this.boards.clear();
        console.info("All boards closed.");

        await this.sim.disconnect();
        console.info("SimConnect disconnected.");
    }
}