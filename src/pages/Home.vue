<template>
    <div>
        <h5>Topics page</h5>
        <ul class="flex flex-col">
            <li v-for="(item, index) in topics.data" :key="index">
                <router-link :to="`/topic?id=${item.c_id}`">{{ item.c_title }}</router-link>
            </li>
        </ul>
        <a @click="getList(topics.page + 1)" type="success" href="javascript:;">下一页</a>
    </div>
</template>

<script>
import { onMounted, onBeforeUnmount, onActivated, computed } from 'vue'
import { useStore } from 'vuex'
import { useRoute } from 'vue-router'
import { useHead } from '@vueuse/head'
import { useWindowScroll } from '@vueuse/core'
import ls from 'store2'

export default {
    asyncData({ store, route }) {
        return store.dispatch('topics/getTopics', { path: route.path, page: 1 })
    },
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

        const getList = page => {
            store.dispatch('topics/getTopics', { page, path: currPath })
        }

        const { y } = useWindowScroll()

        onBeforeUnmount(() => {
            console.log(`onBeforeUnmount`)
            ls.set(currPath, y.value)
        })
        onActivated(() => {
            console.log(`onActivated`)
        })

        onMounted(() => {
            console.log(`onMounted`)
            if (topics.value.path === '') {
                getList(1)
            } else {
                const scrollTop = ls.get(currPath)
                ls.remove(currPath)
                window.scrollTo(0, scrollTop)
            }
        })

        return {
            topics,
            getList
        }
    }
}
</script>
