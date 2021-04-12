<template>
    <div>
        <h5>Topics page</h5>
        <ul class="flex flex-col">
            <li v-for="(item, index) in topics.data" :key="index">
                <router-link :to="`/topic?id=${item.c_id}`">{{ item.c_title }}</router-link>
            </li>
        </ul>
        <!-- <a @click="getList(topics.page + 1)" href="javascript:;">下一页</a> -->
        <el-button @click="getList(topics.page + 1)" :loading="loading" type="primary">下一页</el-button>
    </div>
</template>

<script>
import { onMounted, onBeforeUnmount, onActivated, computed } from 'vue'
import { useStore } from 'vuex'
import { useRoute } from 'vue-router'
import { useHead } from '@vueuse/head'
import { useWindowScroll, useToggle } from '@vueuse/core'
import ls from 'store2'

export default {
    setup() {
        const route = useRoute()
        const store = useStore()

        const currPath = route.path

        const topics = computed(() => {
            return store.state.topics.lists
        })

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
            await store.dispatch('topics/getTopics', { page, path: currPath })
            toggleLoading(false)
        }

        const { y } = useWindowScroll()

        onBeforeUnmount(() => {
            console.log(`Home onBeforeUnmount`)
            ls.set(currPath, y.value)
        })
        onActivated(() => {
            console.log(`Home onActivated`)
        })

        onMounted(() => {
            console.log(`Home onMounted`)
            if (topics.value.path === '') {
                getList(1)
            } else {
                const scrollTop = ls.get(currPath)
                ls.remove(currPath)
                window.scrollTo(0, scrollTop)
            }
        })

        return {
            loading,
            topics,
            getList
        }
    },
    asyncData({ store, route }) {
        return store.dispatch('topics/getTopics', { path: route.path, page: 1 })
    }
}
</script>
