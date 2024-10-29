import type { GlobalStore } from '@/types'
import { acceptHMRUpdate } from 'pinia'

const useStore = defineStore('globalStore', () => {
    const state: GlobalStore = reactive({
        globalLoading: true,
        routerLoading: false,
        ISDEV: import.meta.env.VITE_APP_ENV === 'development',
        ISPRE: import.meta.env.VITE_APP_ENV === 'pre-release',
        ISPROD: import.meta.env.VITE_APP_ENV === 'production',
        cookies: {},
    })

    const setGlobalLoading = (payload: boolean) => {
        state.globalLoading = payload
    }
    const setRouterLoading = (payload: boolean) => {
        state.routerLoading = payload
    }
    const setCookies = (cookies: Record<string, any>) => {
        state.cookies = cookies
    }

    return {
        ...toRefs(state),
        setGlobalLoading,
        setRouterLoading,
        setCookies,
    }
})

export default useStore

if (import.meta.hot) {
    import.meta.hot.accept(acceptHMRUpdate(useStore as any, import.meta.hot))
}
