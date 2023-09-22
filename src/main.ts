import { createSSRApp } from 'vue'
import { createPinia } from 'pinia'
import { createHead } from '@vueuse/head'

import { createRouter } from './router'

import App from './App.vue'

console.log(`当前环境: ${import.meta.env.VITE_APP_ENV}`)

// SSR 需要每个请求一个新的应用程序实例，因此我们导出一个创建新应用程序实例的函数。
// 如果使用 Vuex/Pinia，还需要创建一个新储存。
export function createApp() {
    const app = createSSRApp(App)
    const router = createRouter()
    const store = createPinia()
    const head = createHead()
    app.use(store).use(router).use(head)
    return { app, router, store, head }
}
