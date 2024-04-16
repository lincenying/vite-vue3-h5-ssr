<template>
    <div>
        <div v-if="item.data">
            <h5>Topic page</h5>
            <h6>{{ item.data.c_title }}</h6>
            <div class="content" v-html="item.data.c_content" />
        </div>
    </div>
</template>

<script setup lang="ts">
defineOptions({
    name: 'Topic',
    asyncData(payload: asyncDataConfig) {
        const { store, route, api } = payload
        const topicStore = useTopicStore(store)
        return topicStore.getTopic({ id: route.query.id, path: route.fullPath }, api)
    },
})

// pinia 状态管理 ===>
const topicStore = useTopicStore()
const { item } = $(storeToRefs(topicStore))

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

useHead({
    // Can be static or computed
    title: computed(() => (item.data && item.data.c_title) || ''),
    meta: [
        {
            name: 'description',
            content: computed(() => (item.data && item.data.c_title) || ''),
        },
    ],
})

onMounted(() => {
    const body = document.querySelector('.body')
    if (body) {
        body.scrollTo(0, 0)
    }
})
</script>
