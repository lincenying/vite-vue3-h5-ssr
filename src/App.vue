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

<script setup lang="ts">
defineOptions({
    name: 'app-root'
})

// eslint-disable-next-line no-unused-vars
const { globalStore } = useGlobal()

// pinia 状态管理 ===>
// const { globalLoading } = storeToRefs(globalStore)
// const tmpCount = computed(() => globalStore.counter)
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
