import type { RenderType } from '@/types'
import fs from 'node:fs'
import path from 'node:path'

import { fileURLToPath } from 'node:url'
import { UTC2Date } from '@lincy/utils'
import compression from 'compression'
import cookieParser from 'cookie-parser'
import express from 'express'
import { createProxyMiddleware } from 'http-proxy-middleware'
import logger from 'morgan'
import requestIp from 'request-ip'
import serveStatic from 'serve-static'

export async function createServer() {
    const __dirname = path.dirname(fileURLToPath(import.meta.url))
    const resolve = (p: string) => path.resolve(__dirname, p)
    const template = fs.readFileSync(resolve('client/index.html'), 'utf-8')
    const manifest = JSON.parse(fs.readFileSync(resolve('client/.vite/ssr-manifest.json'), 'utf-8'))
    const app = express()

    logger.token('remote-addr', (req) => {
        return requestIp.getClientIp(req) || 'unknown'
    })

    logger.token('date', () => {
        return UTC2Date(undefined, 'yyyy-mm-dd hh:ii:ss.SSS')
    })

    // Node.js 日志中间件
    app.use(
        logger('[:remote-addr] [:date] ":method :url" :status :res[content-length] ":referrer"', {
            skip(req) {
                const skipExt = ['.webmanifes', '.php', '.txt', '.map', '.js', '.css', '.png', 'jpg', '.jpeg', '.gif', '.ttf', '.woff2', '.ico']
                return skipExt.some((ext) => {
                    return req.url.includes(ext)
                })
            },
        }),
    )

    // Node.js 压缩中间件
    app.use(compression())
    // Node.js 代理中间件, 也可以在 nginx 直接配置, 那么将不会走这里的代理中间件
    app.use(
        createProxyMiddleware({
            target: 'http://php.mmxiaowu.com',
            changeOrigin: true,
            pathFilter: ['/api/**'],
            pathRewrite: {
                '^/api': '/api',
            },
            on: {
                proxyReq(proxyReq, req) {
                    proxyReq.setHeader('X-Real-IP', requestIp.getClientIp(req) || 'unknown')
                },
            },
        }),
    )
    // Node.js 静态资源中间件
    app.use(
        serveStatic(resolve('client'), {
            index: false,
        }),
    )

    // 解析 application/json 中间件
    app.use(express.json())
    // 解析 application/x-www-form-urlencoded 中间件
    app.use(express.urlencoded({ extended: true }))
    // 解析 cookies 中间件
    app.use(cookieParser())

    app.use('/{*default}', async (req, res) => {
        try {
            // const url = req.originalUrl.replace('/test/', '/')
            const url = req.originalUrl

            // @ts-expect-error 未编译, 目录不对, 该文件不存在
            const render = (await import('./server/entry-server.js')).render

            const { html: appHtml, preloadLinks, headTags } = await render(url, manifest, req) as RenderType

            const html = template
                .replace('<!--preload-links-->', preloadLinks)
                .replace('<!--app-html-->', appHtml)
                .replace('<!--head-tags-->', headTags)

            res.status(200).set({ 'Content-Type': 'text/html' }).end(html)
        }
        catch (e: unknown) {
            const err = e as Error
            console.log(err.stack)
            res.status(500).end(err.stack)
        }
    })

    return { app }
}

const port = 7775

createServer().then(({ app }) => app.listen(port, () => {
    console.log(`监听: http://localhost:${port}`)
}))
