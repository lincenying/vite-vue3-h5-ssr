import { createSSRApp } from 'vue'
import { createHead } from '@vueuse/head'
import { createPinia } from 'pinia'

import { createRouter } from './router'
import ElConfig from './config/element'

import App from './App.vue'

console.log('当前环境: ' + import.meta.env.VITE_APP_ENV)

// SSR requires a fresh app instance per request, therefore we export a function
// that creates a fresh app instance. If using Vuex, we'd also be creating a
// fresh store here.
export function createApp() {
    const app = createSSRApp(App)
    const router = createRouter()
    const store = createPinia()
    const head = createHead()
    app.config.globalProperties.$ELEMENT = { size: 'small', zIndex: 3000 }
    ElConfig(app).use(store).use(router).use(head)
    return { app, router, store, head }
}
