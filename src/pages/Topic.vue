<template>
    <div>
        <div v-loading="loading">
            <h5>Topic page</h5>
            <h6>{{ topic.data.c_title }}</h6>
            <div class="content" v-html="topic.data.c_content"></div>
        </div>
    </div>
</template>

<script>
import { onMounted, computed } from 'vue'
import { useStore } from 'vuex'
import { useRoute } from 'vue-router'
import { useHead } from '@vueuse/head'
import { useToggle } from '@vueuse/core'

export default {
    asyncData({ store, route }) {
        return store.dispatch('topics/getTopic', { path: route.fullPath, id: route.query.id })
    },
    setup() {
        const route = useRoute()
        const store = useStore()

        const topic = computed(() => {
            return store.state.topics.item
        })

        const [loading, toggleLoading] = useToggle(false)

        useHead({
            // Can be static or computed
            title: computed(() => topic.value.data.c_title),
            meta: [
                {
                    name: `description`,
                    content: computed(() => topic.value.data.c_title)
                }
            ]
        })

        const getDetail = async () => {
            toggleLoading(true)
            await store.dispatch('topics/getTopic', { id: route.query.id, path: route.fullPath })
            toggleLoading(false)
        }

        onMounted(() => {
            console.log(`Topic onMounted`)
            if (topic.value.path !== route.fullPath) {
                getDetail()
            }
        })

        return {
            loading,
            topic
        }
    }
}
</script>
