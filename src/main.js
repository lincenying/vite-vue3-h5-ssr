import { createSSRApp } from 'vue'
import { createHead } from '@vueuse/head'
import { createRouter } from './router'
import { createStore } from './store'
import ElConfig from './config/element'

import App from './App.vue'

// SSR requires a fresh app instance per request, therefore we export a function
// that creates a fresh app instance. If using Vuex, we'd also be creating a
// fresh store here.
export function createApp() {
    const app = createSSRApp(App)
    const router = createRouter()
    const store = createStore()
    const head = createHead()
    app.config.globalProperties.$ELEMENT = { size: 'small', zIndex: 3000 }
    app.use(store).use(router).use(head)
    ElConfig(app)
    return { app, router, store, head }
}
