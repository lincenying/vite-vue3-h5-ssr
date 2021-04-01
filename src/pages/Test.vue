<template>
    <div>
        <h5>Test page</h5>
        <ul class="flex flex-col">
            <li v-for="(item, index) in topics.data" :key="index">{{ item.c_title }}</li>
        </ul>
        <a @click="getList(topics.page + 1)" href="javascript:;">下一页</a>
    </div>
</template>

<script>
import { onMounted, computed } from 'vue'
import { useStore } from 'vuex'
import { useRoute } from 'vue-router'

export default {
    meta: {
        title: 'Test page title',
        description: 'Test page description',
        keywords: 'Test page keywords'
    },
    asyncData({ store, route }) {
        return store.dispatch('topics/getArticleList', { path: route.path, page: 1 })
    },
    setup() {
        const route = useRoute()
        const store = useStore()

        const topics = computed(() => {
            return store.state.topics.lists
        })

        const getList = page => {
            store.dispatch('topics/getArticleList', { page, path: route.path })
        }

        onMounted(() => {
            if (store.state.topics.path === '') {
                getList(1)
            }
        })

        return {
            topics,
            getList
        }
    }
}
</script>
