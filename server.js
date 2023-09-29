import fs from 'node:fs'
import path from 'node:path'
import process from 'node:process'
import { fileURLToPath } from 'node:url'
import express from 'express'
import cookieParser from 'cookie-parser'
import ejs from 'ejs'
import { createServer as viteCreateServer } from 'vite'
import { createProxyMiddleware } from 'http-proxy-middleware'

const isTest = process.env.NODE_ENV === 'test' || !!process.env.VITE_TEST_BUILD

export async function createServer(root = process.cwd(), isProd = process.env.NODE_ENV === 'production', hmrPort) {
    const __dirname = path.dirname(fileURLToPath(import.meta.url))
    const resolve = p => path.resolve(__dirname, p)
    const indexProd = isProd ? fs.readFileSync(resolve('dist/client/index.html'), 'utf-8') : ''
    const manifest = isProd ? JSON.parse(fs.readFileSync(resolve('dist/client/ssr-manifest.json'), 'utf-8')) : {}
    const app = express()

    /**
     * @type {import('vite').ViteDevServer}
     */
    let vite
    if (!isProd) {
        vite = await viteCreateServer({
            base: '/',
            root,
            logLevel: isTest ? 'error' : 'info',
            server: {
                middlewareMode: true,
                watch: {
                    // 在测试过程中，编辑文件的速度太快，有时 chokidar 会错过更改事件，因此强制轮询以确保一致性
                    usePolling: true,
                    interval: 100,
                },
                hmr: {
                    port: hmrPort,
                },
            },
            appType: 'custom',
        })
        // 使用vite的connect实例作为中间件
        app.use(vite.middlewares)
    }
    else {
        app.use((await import('compression')).default())
        app.use(
            '/api',
            createProxyMiddleware({
                target: 'http://php.mmxiaowu.com',
                changeOrigin: true,
                // pathRewrite: { '^/api': '/api' },
                pathRewrite: path => path.replace(/^\/api/, '/api'),
            }),
        )
        app.use(
            (await import('serve-static')).default(resolve('dist/client'), {
                index: false,
            }),
        )
    }

    // 解析 application/json
    app.use(express.json())
    // 解析 application/x-www-form-urlencoded
    app.use(express.urlencoded({ extended: true }))
    app.use(cookieParser())

    app.set('views', path.join(__dirname, 'dist'))

    app.engine('.html', ejs.__express)
    app.set('view engine', 'ejs')

    app.use('*', async (req, res) => {
        try {
            // const url = req.originalUrl.replace('/test/', '/')
            const url = req.originalUrl

            let template, render
            if (!isProd) {
                // 始终读取开发中的新模板
                template = fs.readFileSync(resolve('index.html'), 'utf-8')
                template = await vite.transformIndexHtml(url, template)
                render = (await vite.ssrLoadModule('/src/entry-server.ts')).render
            }
            else {
                template = indexProd
                render = (await import('./dist/server/entry-server.js')).render
            }

            const [appHtml, preloadLinks, headTags] = await render(url, manifest, req)

            const html = template
                .replace('<!--preload-links-->', preloadLinks)
                .replace('<!--app-html-->', appHtml)
                .replace('<!--head-tags-->', headTags)

            res.status(200).set({ 'Content-Type': 'text/html' }).end(html)
        }
        catch (e) {
            vite && vite.ssrFixStacktrace(e)
            console.log(e.stack)
            res.status(500).end(e.stack)
        }
    })

    return { app, vite }
}

let port = 7775
if (process.env.NODE_ENV !== 'production')
    port = 17775

if (!isTest) {
    createServer().then(({ app }) => app.listen(port, () => {
        console.log(`http://localhost:${port}`)
    }))
}
