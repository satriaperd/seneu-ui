import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import tailwindcss from '@tailwindcss/vite'
import dts from 'vite-plugin-dts'
import { resolve } from 'path'
import { fileURLToPath } from 'url'

const __dirname = fileURLToPath(new URL('.', import.meta.url))

export default defineConfig({
  plugins: [
    vue(),
    tailwindcss(),
    dts({
      include: ['src/components/**/*.vue', 'src/composables/**/*.js', 'src/index.js'],
      exclude: ['src/DevApp.vue', 'src/dev-app.js'],
      outDir: 'dist/types',
      insertTypesEntry: true,
    }),
  ],
  build: {
    lib: {
      entry: resolve(__dirname, 'src/index.js'),
      name: 'SeneuUI',
      fileName: 'seneu-ui',
    },
    rollupOptions: {
      external: ['vue', 'echarts'],
      output: {
        globals: {
          vue: 'Vue',
          echarts: 'echarts',
        },
        assetFileNames: (assetInfo) => {
          if (assetInfo.name?.endsWith('.css')) return 'style.css'
          return assetInfo.name
        },
      },
    },
    cssCodeSplit: false,
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
    },
  },
})
