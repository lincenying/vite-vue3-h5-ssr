// @ts-check
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import express from 'express'
import cookieParser from 'cookie-parser'
import ejs from 'ejs'

const isTest = process.env.NODE_ENV === 'test' || !!process.env.VITE_TEST_BUILD

export async function createServer(root = process.cwd(), isProd = process.env.NODE_ENV === 'production', hmrPort) {
    const __dirname = path.dirname(fileURLToPath(import.meta.url))
    const resolve = p => path.resolve(__dirname, p)

    const indexProd = isProd ? fs.readFileSync(resolve('dist/client/index.html'), 'utf-8') : ''

    // @ts-ignore
    const manifest = isProd ? (await import('./dist/client/ssr-manifest.json')).default : {}

    const app = express()

    /**
     * @type {import('vite').ViteDevServer}
     */
    let vite
    if (!isProd) {
        vite = await (
            await import('vite')
        ).createServer({
            base: '/test/',
            root,
            logLevel: isTest ? 'error' : 'info',
            server: {
                middlewareMode: true,
                watch: {
                    // During tests we edit the files too fast and sometimes chokidar
                    // misses change events, so enforce polling for consistency
                    usePolling: true,
                    interval: 100
                },
                hmr: {
                    port: hmrPort
                }
            },
            appType: 'custom'
        })
        // use vite's connect instance as middleware
        app.use(vite.middlewares)
    } else {
        app.use((await import('compression')).default())
        app.use(
            '/test/',
            (await import('serve-static')).default(resolve('dist/client'), {
                index: false
            })
        )
    }

    // parse application/json
    app.use(express.json())
    // parse application/x-www-form-urlencoded
    app.use(express.urlencoded({ extended: true }))
    app.use(cookieParser())

    app.set('views', path.join(__dirname, 'dist'))
    // @ts-ignore
    app.engine('.html', ejs.__express)
    app.set('view engine', 'ejs')

    app.use('*', async (req, res) => {
        try {
            const url = req.originalUrl.replace('/test/', '/')

            let template, render
            if (!isProd) {
                // always read fresh template in dev
                template = fs.readFileSync(resolve('index.html'), 'utf-8')
                template = await vite.transformIndexHtml(url, template)
                render = (await vite.ssrLoadModule('/src/entry-server.js')).render
            } else {
                template = indexProd
                // @ts-ignore
                render = (await import('./dist/server/entry-server.js')).render
            }

            const [appHtml, preloadLinks, headTags] = await render(url, manifest)

            const html = template
                .replace(`<!--preload-links-->`, preloadLinks)
                .replace(`<!--app-html-->`, appHtml)
                .replace(`<!--head-tags-->`, headTags)

            res.status(200).set({ 'Content-Type': 'text/html' }).end(html)
        } catch (e) {
            // eslint-disable-next-line no-unused-expressions
            vite && vite.ssrFixStacktrace(e)
            console.log(e.stack)
            res.status(500).end(e.stack)
        }
    })

    // @ts-ignore
    return { app, vite }
}

let port = 7775
if (process.env.NODE_ENV !== 'production') {
    port = 17775
}

if (!isTest) {
    createServer().then(({ app }) =>
        app.listen(port, () => {
            console.log('http://localhost:' + port)
        })
    )
}
