/* eslint-disable antfu/no-import-dist */
// Pre-render the app into static HTML.
// run `yarn generate` and then `dist/static` can be served as a static site.

import { readdirSync, readFileSync, unlinkSync, writeFileSync } from 'node:fs'
import { resolve } from 'node:path'

import manifest from './dist/client/.vite/ssr-manifest.json'
import { render } from './dist/server/entry-server.js'

const toAbsolute = (p: string) => resolve(__dirname, p)

const template = readFileSync(toAbsolute('dist/static/index.html'), 'utf-8')

// determine routes to pre-render from src/pages
const routesToPrerender = readdirSync(toAbsolute('src/pages')).map((file) => {
    const name = file.replace(/\.vue$/, '').toLowerCase()
    return name === 'home' ? '/' : `/${name}`
})

;(async () => {
    // pre-render each route...
    for (const url of routesToPrerender) {
        const { html: appHtml, preloadLinks } = await render(url, manifest)

        const html = template.replace('<!--preload-links-->', preloadLinks as string).replace('<!--app-html-->', appHtml as string)

        const filePath = `dist/static${url === '/' ? '/index' : url}.html`
        writeFileSync(toAbsolute(filePath), html)
        console.log('pre-rendered:', filePath)
    }

    // done, delete ssr manifest
    unlinkSync(toAbsolute('dist/client/.vite/ssr-manifest.json'))
})()
