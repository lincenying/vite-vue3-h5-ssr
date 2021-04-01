<template>
    <div>
        <h5>Topic page</h5>
        <h6>{{ topic.data.c_title }}</h6>
        <div class="content" v-html="topic.data.c_content"></div>
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
        return store.dispatch('topics/getTopic', { path: route.fullPath, id: route.query.id })
    },
    setup() {
        const route = useRoute()
        const store = useStore()

        const topic = computed(() => {
            return store.state.topics.item
        })

        const getDetail = () => {
            store.dispatch('topics/getTopic', { id: route.query.id, path: route.fullPath })
        }

        onMounted(() => {
            if (topic.value.path !== route.fullPath) {
                getDetail()
            }
        })

        return {
            topic
        }
    }
}
</script>
