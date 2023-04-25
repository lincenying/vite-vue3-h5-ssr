import { createRouter as _createRouter, createMemoryHistory, createWebHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'

// Auto generates routes from vue files under ./pages
// https://vitejs.dev/guide/features.html#glob-import
const pages = import.meta.glob('./pages/*.vue')

let routes: Array<RouteRecordRaw> = []
Object.keys(pages).forEach((path: string) => {
    const math = path.match(/\.\/pages(.*)\.vue$/)
    if (math) {
        const name = math[1].toLowerCase()
        routes.push({
            name: name.replace('/', ''),
            path: name === '/home' ? '/' : name,
            component: pages[path], // () => import('./pages/*.vue')
        })
    }
    return {}
})

routes = routes.concat([{ path: '/:pathMatch(.*)', redirect: '/' }])

export function createRouter() {
    return _createRouter({
        // use appropriate history implementation for server/client
        // import.meta.env.SSR is injected by Vite.
        history: import.meta.env.SSR ? createMemoryHistory() : createWebHistory(),
        routes,
    })
}
