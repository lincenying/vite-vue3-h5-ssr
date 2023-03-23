import type { Fn } from '@/types'

export const useGlobal = () => {
    const ins = getCurrentInstance()!

    const ctx = ins.appContext.config.globalProperties
    const options = ins.type
    const route = useRoute()
    const router = useRouter()
    const globalStore = useGlobalStore()

    // eslint-disable-next-line no-unused-vars

    return {
        ctx,
        options,
        route,
        router,
        globalStore
    }
}

// autoUnlock === true 不管 fn 返回什么, 都自动解锁
// autoUnlock === false 不管 fn 返回什么, 都不自动解锁
// autoUnlock === 'auto' 当 fn 返回 false 时, 不自动解锁, 返回其他值时, 自动解锁
export const useLockFn = (fn: Fn, autoUnlock: boolean | string = 'auto') => {
    const [lock, toggleLock] = useToggle(false)
    return async (...args: any[]) => {
        if (lock.value) return
        toggleLock(true)
        try {
            const $return: any = await fn(...args)
            if (autoUnlock === true || (autoUnlock === 'auto' && $return !== false)) toggleLock(false)
        } catch (e) {
            toggleLock(false)
            throw e
        }
    }
}
