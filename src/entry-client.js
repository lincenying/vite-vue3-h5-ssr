import { createApp } from './main'
import api from './api/index-client'

import 'virtual:windi.css'
import '@/assets/scss/style.scss'

const { app, router, store } = createApp()

// wait until router is ready before mounting to ensure hydration match
router.isReady().then(() => {
    app.mount('#app')
    console.log('client router ready')
})

if (window.__INITIAL_STATE__) {
    store.replaceState(window.__INITIAL_STATE__)
    store.$api = store.state.$api = api
}
