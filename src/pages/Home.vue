<template>
    <div>
        <h5>Topics page</h5>
        <ul class="flex flex-col">
            <li v-for="(item, index) in lists.data" :key="index">
                <router-link :to="`/topic?id=${item.c_id}`">{{ item.c_title }}</router-link>
            </li>
        </ul>
        <van-button @click="getList(lists.page + 1)" :loading="loading" type="primary" size="small">下一页</van-button>
    </div>
</template>

<script setup>
import ls from 'store2'

defineOptions({
    name: 'home',
    asyncData({ store, route, api }) {
        const topicStore = useTopicStore(store)
        return topicStore.getTopics({ path: route.path, page: 1 }, api)
    }
})

// eslint-disable-next-line no-unused-vars
const { ctx, options, route, router, globalStore, useLockFn, useDataIsLoaded } = useGlobal('app-root')

// pinia 状态管理 ===>
const topicStore = useTopicStore()
const { lists } = storeToRefs(topicStore)
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
            name: `description`,
            content: '首页'
        }
    ]
})

const [loading, toggleLoading] = useToggle(false)

const getList = async page => {
    toggleLoading(true)
    topicStore.getTopics({ path: currPath, page })
    toggleLoading(false)
}

const { y } = useWindowScroll()

onBeforeUnmount(() => {
    console.log(`Home onBeforeUnmount`)
    ls.set(currPath, y.value)
    ls.set(currPath, document.querySelector('.body').scrollTop)
})
onActivated(() => {
    console.log(`Home onActivated`)
})

onMounted(() => {
    console.log(`Home onMounted`)
    if (lists.value.path === '') {
        getList(1)
    } else {
        const scrollTop = ls.get(currPath)
        ls.remove(currPath)
        // window.scrollTo(0, scrollTop)
        document.querySelector('.body').scrollTo(0, scrollTop)
    }
})
</script>
