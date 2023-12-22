import vue from '@vitejs/plugin-vue'
import dns from 'dns'
import { defineConfig } from 'vite'

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
  ],
})
