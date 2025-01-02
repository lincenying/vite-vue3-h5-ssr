<template>
    <div>
        <h5>Topics page</h5>
        <ul class="flex flex-col">
            <li v-for="(item, index) in lists.data" :key="index">
                <router-link :to="`/topic?id=${item.c_id}`">
                    {{ item.c_title }}
                </router-link>
            </li>
        </ul>
        <van-button :loading="loading" type="primary" size="small" @click="getList(lists.page + 1)">
            下一页
        </van-button>
    </div>
</template>

<script setup lang="ts">
import { sleep } from '@lincy/utils'
import ls from 'store2'

defineOptions({
    name: 'Home',
    asyncData(payload: asyncDataConfig) {
        const { store, route, api } = payload
        const topicStore = useTopicStore(store)
        return topicStore.getTopics({ path: route.fullPath, page: 1 }, api)
    },
})

const { route } = useGlobal()

// pinia 状态管理 ===>
const topicStore = useTopicStore()
const { lists } = $(storeToRefs(topicStore))

// const tmpCount = computed(() => globalStore.counter)
// 监听状态变化
// globalStore.$subscribe((mutation, state) => {
//     console.log('mutation :>> ', mutation)
//     console.log('state :>> ', JSON.stringify(state))
// })
// pinia 状态管理 <===

// 全局组件通信 ===>
// const dataIsReady = ref(0)
// provide(
//     'dataIsReady',
//     computed(() => dataIsReady.value)
// )
// const showDialog = ref(false)
// provide(
//     'showDialog',
//     computed(() => showDialog.value)
// )
// provide('toggleDialog', payload => {
//     showDialog.value = payload
// })
// 全局组件通信 <===

// 父子组件通讯 ===>
// const onClose = payload => {
//     console.log(payload)
// }
// 父子组件通讯 <===

const currPath = route.path

useHead({
    // Can be static or computed
    title: '首页',
    meta: [
        {
            name: 'description',
            content: '首页',
        },
    ],
})

const [loading, toggleLoading] = useToggle(false)

async function getList(page: number) {
    toggleLoading(true)
    await sleep(1000)
    await topicStore.getTopics({ path: currPath, page })
    toggleLoading(false)
}

const { y } = useWindowScroll()

onBeforeUnmount(() => {
    console.log('Home onBeforeUnmount')
    ls.set(currPath, y.value)
    const body = document.querySelector('.body')
    if (body) {
        ls.set(currPath, body.scrollTop)
    }
})
onActivated(() => {
    console.log('Home onActivated')
})

onMounted(() => {
    console.log('Home onMounted')
    if (lists.path === '') {
        getList(1)
    }
    else {
        const scrollTop = ls.get(currPath)
        ls.remove(currPath)
        // window.scrollTo(0, scrollTop)
        const body = document.querySelector('.body')
        if (body) {
            body.scrollTo(0, scrollTop)
        }
    }
})
</script>
