import path from 'node:path'
import { fileURLToPath } from 'node:url'

import type { UserConfig } from 'vite'
import apiDomain from './src/api/url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

const config: UserConfig = {
    build: {
        target: 'es2018',
        cssTarget: 'chrome79',
        minify: true,
        assetsInlineLimit: 4096,
        chunkSizeWarningLimit: 1000,
        outDir: 'dist',
        rollupOptions: {
            input: {
                main: path.resolve(__dirname, 'index.html'),
            },
            external: /\.\/static.*/,
        },
    },
    server: {
        port: 7775,
        host: '0.0.0.0',
        proxy: {
            '/api': {
                target: apiDomain,
                changeOrigin: true,
                rewrite: (path: string) => path.replace(/^\/api/, '/api'),
                configure: (proxy, _options) => {
                    proxy.on('proxyReq', (proxyReq, req, _res) => {
                        proxyReq.setHeader('X-Real-IP', req.socket.remoteAddress || 'unknown')
                    })
                },
            },
        },
    },
}

export default config
