<template>
    <div>
        <h5>Topics page</h5>
        <ul class="flex flex-col">
            <li v-for="(item, index) in lists.data" :key="index">
                <router-link :to="`/topic?id=${item.c_id}`">{{ item.c_title }}</router-link>
            </li>
        </ul>
        <el-button @click="getList(lists.page + 1)" :loading="loading" type="primary">下一页</el-button>
    </div>
</template>

<script>
import { onMounted, onBeforeUnmount, onActivated } from 'vue'
import { useHead } from '@vueuse/head'
import { useWindowScroll } from '@vueuse/core'
import ls from 'store2'

import useGlobal from '@/mixins/global'

import { useTopicStore } from '@/pinia/topics'

export default {
    asyncData({ store, route, api }) {
        const topicStore = useTopicStore(store)
        return topicStore.getTopics({ path: route.path, page: 1 }, api)
    }
}
</script>
<script setup name="home">
// eslint-disable-next-line no-unused-vars
const { ctx, options, proxy, route, router, storeToRefs, globalStore, ref, reactive, useToggle, useLockFn } = useGlobal()

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
