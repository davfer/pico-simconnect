import {createApp} from 'vue'
import './style.css'
import App from './App.vue'
import log from 'electron-log/renderer';

// Configure console transport for the renderer process
// Default renderer format is: '{h}:{i}:{s}.{ms} › {text}'
// We'll prepend [RENDERER] and add %c for consistency with main process format.
// log.transports.console.format = '[RENDERER] %c{h}:{i}:{s}.{ms}%c › {text}';

// Override global console object with electron-log functions for the renderer
// Object.assign(console, log.functions);

createApp(App).mount('#app').$nextTick(() => {
    // Use contextBridge
    window.ipcRenderer.on('main-process-message', (_event, message) => {
        console.log(message) // This will now use electron-log
    })
})
