import { defineConfig } from 'vite'
import path from 'node:path'
import electron from 'vite-plugin-electron/simple'
import vue from '@vitejs/plugin-vue'
import tailwindcss from '@tailwindcss/vite'

// https://vitejs.dev/config/
export default defineConfig({
  resolve: {
    alias: {
      '@shared': path.resolve(__dirname, 'shared'),
      '@src': path.resolve(__dirname, 'src'),
    },
  },
  plugins: [
    tailwindcss(),
    vue(),
    electron({
      main: {
        // Shortcut of `build.lib.entry`.
        entry: 'electron/main.ts',
        vite: {
          resolve: {
            alias: {
              '@shared': path.resolve(__dirname, 'shared'),
              '@electron': path.resolve(__dirname, 'electron'),
              '@callbacks': path.resolve(__dirname, 'callbacks'),
              '@src': path.resolve(__dirname, 'src'),
            },
          },
          build: {
            rollupOptions: {
              external: ['node-hid', 'node-simconnect'], // ✅ Do not bundle native modules
            },
            target: 'node18',
          },
        },
      },
      preload: {
        // Shortcut of `build.rollupOptions.input`.
        // Preload scripts may contain Web assets, so use the `build.rollupOptions.input` instead `build.lib.entry`.
        input: path.join(__dirname, 'electron/preload.ts'),
      },
      // Ployfill the Electron and Node.js API for Renderer process.
      // If you want use Node.js in Renderer process, the `nodeIntegration` needs to be enabled in the Main process.
      // See 👉 https://github.com/electron-vite/vite-plugin-electron-renderer
      renderer: process.env.NODE_ENV === 'test'
        // https://github.com/electron-vite/vite-plugin-electron-renderer/issues/78#issuecomment-2053600808
        ? undefined
        : {},
    }),
  ],
})
