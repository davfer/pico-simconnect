import { app, BrowserWindow, ipcMain } from "electron";
import { fileURLToPath } from "node:url";
import path from "node:path";
import { devices, HID } from "node-hid";
import { open, Protocol, SimConnectConstants, EventFlag } from "node-simconnect";
var BoardInterfaceType = /* @__PURE__ */ ((BoardInterfaceType2) => {
  BoardInterfaceType2["BUTTON"] = "button";
  BoardInterfaceType2["LED"] = "led";
  return BoardInterfaceType2;
})(BoardInterfaceType || {});
const CMD_TRIGGER_PIN = 3;
const CMD_READ_PINS = 4;
class Device {
  constructor(vendorId, productId, interfaces, pollingMs = 1e3) {
    this.vendorId = vendorId;
    this.productId = productId;
    this.interfaces = interfaces;
    this.pollingMs = pollingMs;
  }
  device = null;
  listeners = /* @__PURE__ */ new Map();
  static list() {
    return devices().map((device) => {
      return {
        vid: device.vendorId,
        pid: device.productId,
        product: device.product || "Unknown Device"
      };
    });
  }
  async open() {
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
  async startPolling() {
    setInterval(async () => {
      if (!this.device) {
        console.warn("Device not opened, cannot poll");
        return;
      }
      try {
        const response = await this.sendCmd(CMD_READ_PINS, []);
        console.log("Response:", response);
        await this.parsePollingResponse(response);
      } catch (error) {
        console.error("Error during polling:", error);
      }
    }, this.pollingMs);
  }
  async parsePollingResponse(response) {
    if (response.length < 1) {
      console.warn("Empty response received");
      return;
    }
    for (let i = 0; i < response.length; i++) {
      const inputBlockOffset = i * 8;
      for (let bit = 0; bit < 8; bit++) {
        const pinOffset = inputBlockOffset + bit;
        const pinValue = response[i] >> bit & 1;
        const iface = this.interfaces.filter((i2) => i2?.type === BoardInterfaceType.BUTTON).find((i2) => i2?.offset === pinOffset);
        if (!iface) {
          continue;
        }
        if (iface?.value?.value != pinValue) {
          const listener = this.listeners.get(iface.id);
          if (!listener) {
            continue;
          }
          const value = {
            value: pinValue,
            lastValueChange: /* @__PURE__ */ new Date(),
            previousValue: iface?.value?.value
          };
          iface.value = value;
          try {
            listener(value);
          } catch (error) {
          }
        }
      }
    }
  }
  async trigger(id, value) {
    if (!this.device) {
      throw new Error("Device not opened");
    }
    const iface = this.interfaces.find((i) => i?.id === id);
    if (!iface) {
      throw new Error(`Interface with id ${id} not found`);
    }
    if (iface?.type !== BoardInterfaceType.LED) {
      throw new Error(`Interface with id ${id} is not a LED`);
    }
    const led = iface;
    const cmd = CMD_TRIGGER_PIN;
    const data = [led?.offset, value !== 0 ? 1 : 0];
    await this.sendCmd(cmd, data);
    return iface;
  }
  onChange(id, callback) {
    if (this.listeners.has(id)) {
      console.warn(`Listener for ${id} already exists`);
      return;
    }
    this.listeners.set(id, callback);
  }
  offChange(id) {
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
      console.log(`Device closed: ${this.vendorId}:${this.productId}`);
    }
  }
  async sendCmd(cmd, data) {
    if (!this.device) {
      throw new Error("Device not opened");
    }
    this.device.write([cmd, ...data]);
    console.log(`Command ${cmd} sent with data:`, data);
    const res = this.device.readSync();
    if (!res.length || res[0] !== 0) {
      throw new Error("liaf");
    }
    return res.slice(1);
  }
}
const registry = /* @__PURE__ */ new Map();
const getCallback = (id) => {
  return registry.get(id);
};
class Board {
  constructor(sim, vendorId, productId, items) {
    this.sim = sim;
    const interfaces = items.filter((item) => !!item.iface).map((item) => item.iface);
    this.device = new Device(vendorId, productId, interfaces);
    for (const item of items) {
      if (item.sim) {
        const d = {
          swid: item.id,
          hwid: item.sim.offset,
          type: item.sim.type,
          callback: (cbDescriptor, value) => {
            if (item.onSimReadFnName) {
              const dalCallback = getCallback(item.onSimReadFnName);
              if (dalCallback) {
                console.info(`Calling DAL callback ${item.onSimReadFnName} with value ${value}`);
                dalCallback(cbDescriptor, value);
              }
            }
            if (item.sim?.type == "event" || item.sim?.type == "data") {
              const eventCallback = this.listeners.get(item.id);
              if (eventCallback) {
                console.info(`Triggering FRONTEND for ${item.id} with value ${value}`);
                eventCallback(item.id, value);
              }
            }
          }
        };
        this.sim.register(d);
      }
      if (item.iface) {
        this.device.onChange(item.iface.id, (value) => {
          if (item.onDeviceReadFnName) {
            const dalCallback = getCallback(item.onDeviceReadFnName);
            if (dalCallback) {
              console.info(`Calling DAL callback ${item.onSimReadFnName} with value ${value}`);
              dalCallback(value);
            }
          }
          if (item.iface?.type == BoardInterfaceType.BUTTON) {
            const eventCallback = this.listeners.get(item.id);
            if (eventCallback) {
              console.info(`Triggering FRONTEND for ${item.id} with value ${value}`);
              eventCallback(item.id, value.value);
            }
          }
        });
      }
    }
  }
  device;
  listeners = /* @__PURE__ */ new Map();
  async open() {
    await this.device.open();
  }
  async close() {
    await this.device.close();
  }
  onChange(id, callback) {
    if (this.listeners.has(id)) {
      console.warn(`Listener for ${id} already exists`);
      return;
    }
    this.listeners.set(id, callback);
  }
}
const EVENT_ID_PAUSE = 1;
class Sim {
  sim = void 0;
  definitions = [];
  constructor() {
  }
  async connect() {
    try {
      const { handle, recvOpen } = await open("My SimConnect client", Protocol.FSX_SP2);
      this.sim = handle;
      console.log("Connected to", recvOpen.applicationName);
      for (const def of this.definitions) {
        this.subscribeToSim(def);
      }
      console.log("SimConnect subscribed to all definitions:", this.definitions.length);
    } catch (error) {
      console.error("Failed to connect to SimConnect:", error);
      throw error;
    }
    this.sim.on("event", (recvEvent) => {
      switch (recvEvent.clientEventId) {
        case EVENT_ID_PAUSE:
          console.log(recvEvent.data === 1 ? "Sim paused" : "Sim unpaused");
          break;
      }
      const def = this.definitions.find((d) => d.hwid === recvEvent.clientEventId);
      if (!def || !def.callback) {
        console.debug(`Received event with untracked ID: ${recvEvent.clientEventId}`);
        return;
      }
      try {
        def.callback(def, recvEvent.data);
      } catch (error) {
      }
    });
    this.sim.on("clientData", (recvSimObjectData) => {
      console.log("Received client data:", recvSimObjectData);
      const def = this.definitions.find((d) => d.hwid === recvSimObjectData.requestID);
      if (!def || !def.callback) {
        console.debug(`Received data with untracked ID: ${recvSimObjectData.requestID}`);
        return;
      }
      try {
        def.callback(def, recvSimObjectData.data);
      } catch (error) {
      }
    });
    this.sim.on("exception", function(recvException) {
      console.log(recvException);
    });
    this.sim.on("quit", () => {
      console.log("The simulator quit.");
      if (!this.sim) {
        return;
      }
      this.sim.close();
      this.sim = void 0;
    });
    this.sim.on("close", () => {
      console.log("Connection closed unexpectedly.");
      if (!this.sim) {
        return;
      }
      this.sim.close();
      this.sim = void 0;
    });
    this.sim.subscribeToSystemEvent(EVENT_ID_PAUSE, "Pause");
  }
  async disconnect() {
    if (!this.sim) {
      console.warn("SimConnect is not connected");
      return;
    }
    try {
      this.sim.close();
      this.sim = void 0;
      console.log("SimConnect disconnected successfully");
    } catch (error) {
      console.error("Failed to disconnect SimConnect:", error);
    }
  }
  subscribeToSim(_) {
    if (!this.sim) {
      throw new Error("SimConnect not connected");
    }
  }
  register(descriptor) {
    if (this.definitions.some((d) => d.swid === descriptor.swid)) {
      throw new Error(`Watcher with ID ${descriptor.swid} already registered`);
    }
    this.definitions.push(descriptor);
    if (this.sim) {
      this.subscribeToSim(descriptor);
    }
  }
  trigger(id, value) {
    if (!this.sim) {
      throw new Error("SimConnect not connected");
    }
    const def = this.definitions.find((d) => d.swid === id);
    if (!def) {
      throw new Error(`No definition found for ID: ${id}`);
    }
    this.sim.transmitClientEvent(
      SimConnectConstants.OBJECT_ID_USER,
      def.hwid,
      value,
      0,
      EventFlag.EVENT_FLAG_GROUPID_IS_PRIORITY
    );
  }
}
class BackBoard {
  constructor(ipc, mainWindow) {
    this.ipc = ipc;
    this.mainWindow = mainWindow;
    console.log("Starting back board...");
    this.ipc.handle("init-sim", async () => {
      console.info("Initializing SimConnect...");
      return this.sim.connect().then(() => {
        console.info("SimConnect initialized successfully.");
        return { success: true };
      }).catch((err) => {
        console.error("Failed to initialize SimConnect:", err);
        return { success: false, error: err.message };
      });
    });
    this.ipc.handle("init-board", (_, args) => {
      const { id, vendorId, productId, items } = args;
      if (this.boards.has(id)) {
        console.warn(`Board with id ${id} already exists.`);
        return { success: false, error: `Board with id ${id} already exists.` };
      }
      console.info("Starting board with id:", id, "vid:", vendorId, "pid:", productId, "items:", items.length);
      const board = new Board(this.sim, vendorId, productId, items || []);
      board.open().then(() => {
        console.info(`Board ${id} opened successfully.`);
      }).catch((err) => {
        console.error(`Failed to open board ${id}:`, err);
      });
      for (const item of items) {
        board.onChange(item.id, (id2, value) => {
          console.info(`Board ${id2} triggered item ${item.id} with value ${value}`);
          this.mainWindow.webContents.send("board-changed", id2, item.id, value);
        });
      }
      this.boards.set(id, board);
      return { success: true };
    });
  }
  boards = /* @__PURE__ */ new Map();
  sim = new Sim();
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
const __dirname = path.dirname(fileURLToPath(import.meta.url));
process.env.APP_ROOT = path.join(__dirname, "..");
const VITE_DEV_SERVER_URL = process.env["VITE_DEV_SERVER_URL"];
const MAIN_DIST = path.join(process.env.APP_ROOT, "dist-electron");
const RENDERER_DIST = path.join(process.env.APP_ROOT, "dist");
process.env.VITE_PUBLIC = VITE_DEV_SERVER_URL ? path.join(process.env.APP_ROOT, "public") : RENDERER_DIST;
let win;
function createWindow() {
  win = new BrowserWindow({
    icon: path.join(process.env.VITE_PUBLIC, "electron-vite.svg"),
    webPreferences: {
      preload: path.join(__dirname, "preload.mjs")
    }
  });
  win.webContents.on("did-finish-load", () => {
    win?.webContents.send("main-process-message", (/* @__PURE__ */ new Date()).toLocaleString());
  });
  win.webContents.on("before-input-event", (_, input) => {
    if (input.type === "keyDown" && input.key === "F12") {
      win?.webContents.openDevTools({ mode: "detach" });
    }
  });
  win.on("close", async () => {
    console.log("Window is closing, unloading board...");
    await board.close();
  });
  if (VITE_DEV_SERVER_URL) {
    win.loadURL(VITE_DEV_SERVER_URL);
  } else {
    win.loadFile(path.join(RENDERER_DIST, "index.html"));
  }
  const board = new BackBoard(ipcMain, win);
}
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
    win = null;
  }
});
app.on("activate", () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});
app.whenReady().then(() => {
  createWindow();
});
export {
  MAIN_DIST,
  RENDERER_DIST,
  VITE_DEV_SERVER_URL
};
