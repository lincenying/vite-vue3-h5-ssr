import { acceptHMRUpdate } from 'pinia'
import type { GlobalStore } from '@/types'

const useStore = defineStore('globalStore', {
    state: (): GlobalStore => ({
        globalLoading: true,
        routerLoading: false,
        ISDEV: import.meta.env.VITE_APP_ENV === 'development',
        ISPRE: import.meta.env.VITE_APP_ENV === 'pre-release',
        ISPROD: import.meta.env.VITE_APP_ENV === 'production'
    }),
    getters: {
        getGlobalStore: state => state
    },
    actions: {
        setGlobalLoading(payload: boolean) {
            this.globalLoading = payload
        },
        setRouterLoading(payload: boolean) {
            this.routerLoading = payload
        }
    }
})
export default useStore

if (import.meta.hot) import.meta.hot.accept(acceptHMRUpdate(useStore, import.meta.hot))
