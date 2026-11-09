import {
    defineConfig
} from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
    plugins: [react()],
    server: {
        port: 3000,
        // Escuchar en todas las interfaces (IPv4 e IPv6) para que el reenvio
        // de puertos del devcontainer de VS Code pueda conectarse
        host: true
    },
    build: {
        outDir: 'dist'
    }
})