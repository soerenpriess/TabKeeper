import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import tailwindcss from '@tailwindcss/vite'
import hotReloadExtension from 'hot-reload-extension-vite'

export default defineConfig({
  base: './',
  plugins: [
    vue(),
    tailwindcss(),
    hotReloadExtension({ log: true })
  ],
  build: {
    outDir: 'dist',
    rollupOptions: {
      input: 'index.html',
      output: {
        entryFileNames: '[name].js',
        chunkFileNames: '[name].js',
        assetFileNames: '[name].[ext]'
      }
    }
  }
})

