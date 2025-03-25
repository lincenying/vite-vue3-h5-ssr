import type { RouteComponent } from 'vue-router'
import { createHead } from '@unhead/vue/client'
import { createApp } from './main'

import 'uno.css'
import 'vant/es/dialog/style'
import './assets/scss/global/global.scss'
import './assets/scss/style.scss'

type CustomType = RouteComponent & {
    asyncData?: AnyFn
}

const { app, router, store } = createApp()
const head = createHead()

// wait until router is ready before mounting to ensure hydration match
router.isReady().then(() => {
    router.beforeResolve(async (to, from) => {
        let diffed = false
        const activated = to.matched.filter((c, i) => {
            return diffed || (diffed = from.matched[i] !== c)
        })

        if (!activated.length) {
            return false
        }

        await Promise.all(
            activated.map((c) => {
                const routeComponent = c.components?.default as CustomType
                if (routeComponent && routeComponent.asyncData) {
                    return routeComponent.asyncData({ store, route: to })
                }

                return true
            }),
        )
    })
    app.use(head)
    app.mount('#app')
    console.log('client router ready')
})

if (window.__INITIAL_STATE__) {
    store.state.value = window.__INITIAL_STATE__
}
