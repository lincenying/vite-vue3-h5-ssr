import path from 'node:path'
import { fileURLToPath } from 'node:url'

import apiDomain from './src/api/url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

export default {
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
            external: /\.\/assets.*/,
        },
    },
    server: {
        port: 7775,
        host: '0.0.0.0',
        hot: true,
        disableHostCheck: true,
        proxy: {
            '/api': {
                target: apiDomain,
                changeOrigin: true,
                rewrite: (path: string) => path.replace(/^\/api/, '/api'),
            },
        },
    },
}
