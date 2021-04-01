import { createSSRApp } from 'vue'
import { createHead } from '@vueuse/head'
import { createRouter } from './router'
import { createStore } from './store'

import App from './App.vue'

// SSR requires a fresh app instance per request, therefore we export a function
// that creates a fresh app instance. If using Vuex, we'd also be creating a
// fresh store here.
export function createApp() {
    const app = createSSRApp(App)
    const router = createRouter()
    const store = createStore()
    const head = createHead()
    app.use(store).use(router).use(head)
    return { app, router, store, head }
}