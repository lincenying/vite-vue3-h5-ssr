import { createApp } from './main'

import 'uno.css'
import 'vant/es/dialog/style'
import '@/assets/scss/style.scss'

const { app, router, store } = createApp()

// wait until router is ready before mounting to ensure hydration match
router.isReady().then(() => {
    router.beforeResolve(async (to, from) => {
        let diffed = false
        const activated = to.matched.filter((c, i) => {
            return diffed || (diffed = from.matched[i] !== c)
        })

        if (!activated.length)
            return false

        await Promise.all(
            activated.map((c) => {
                if ((c.components?.default as any).asyncData)
                    return (c.components?.default as any).asyncData({ store, route: to })

                return true
            }),
        )
    })
    app.mount('#app')
    console.log('client router ready')
})

if (window.__INITIAL_STATE__)
    store.state.value = window.__INITIAL_STATE__
