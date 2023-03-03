<template>
    <div class="main">
        <div class="header">
            <router-link :to="`/`">HOME</router-link>
            <router-link :to="`/about`">ABOUT</router-link>
        </div>
        <div class="body">
            <router-view v-slot="{ Component }">
                <component :is="Component" />
            </router-view>
        </div>
    </div>
</template>

<script setup name="app-root">
import 'uno.css'
import 'vant/es/dialog/style'
import '@/assets/scss/style.scss'

// eslint-disable-next-line no-unused-vars
const { ctx, options, route, router, globalStore, useLockFn, useDataIsLoaded } = useGlobal('app-root')

// pinia 状态管理 ===>
// const { globalLoading } = storeToRefs(globalStore)
// const tmpCount = computed(() => globalStore.counter)
// 监听状态变化
globalStore.$subscribe((mutation, state) => {
    if (mutation.events) {
        console.log(
            `%c[${mutation.storeId}.${mutation?.events?.key}] <${mutation.type}> >>> ${mutation?.events?.oldValue} => ${mutation?.events?.newValue}`,
            'color: red'
        )
    }
    console.log('%c[state] >> ', 'color: red')
    console.log(state)
    console.log('%c<< [state]', 'color: red')
})
// pinia 状态管理 <===

const init = async () => {
    setTimeout(() => {
        globalStore.setGlobalLoading(false)
        // toggleneedLogin(true)
    }, 200)
}

onMounted(async () => {
    init()
})
</script>
