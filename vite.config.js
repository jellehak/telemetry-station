import vue from '@vitejs/plugin-vue'
import dns from 'dns'
import { defineConfig } from 'vite'
import { VitePWA } from "vite-plugin-pwa"

// Fix to use localhost instead of http://127.0.0.1/
dns.setDefaultResultOrder('verbatim')

// https://vitejs.dev/config/
export default defineConfig({
  /** allow hosting in subfolders like gh-pages */
  base: './',
  plugins: [
    vue({
      template: {
        compilerOptions: {
          isCustomElement: (tag) => tag.includes('a-'),
        },
      }
    }),
    VitePWA({
      registerType: 'autoUpdate', // 'prompt', 'autoUpdate'
      manifest: {
        name: 'TelemetryStation',
        short_name: 'TelemetryStation',
        theme_color: '#306AD2',
        background_color: '#306AD2',
        description: "Simple monitoring over serial or HTTP.",
        icons: [
          {
            src: './pwa-192.jpg',
            sizes: '192x192',
            type: 'image/jpg',
            "purpose": "any"
          }
        ],
      }
    })
  ],
})
