<template>
    <div>
        <h5>Topics page</h5>
        <ul class="flex flex-col">
            <li v-for="(item, index) in topics.data" :key="index">
                <router-link :to="`/topic?id=${item.c_id}`">{{ item.c_title }}</router-link>
            </li>
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
        return store.dispatch('topics/getTopics', { path: route.path, page: 1 })
    },
    setup() {
        const route = useRoute()
        const store = useStore()

        const topics = computed(() => {
            return store.state.topics.lists
        })

        const getList = page => {
            store.dispatch('topics/getTopics', { page, path: route.path })
        }

        onMounted(() => {
            if (topics.value.path === '') {
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
