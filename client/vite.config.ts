import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import node_path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
    build: {
        outDir: './dist',
    },
    resolve: {
        alias: {
            "@": node_path.resolve(__dirname, 'src'),
        },
    },
    plugins: [vue()],
})
