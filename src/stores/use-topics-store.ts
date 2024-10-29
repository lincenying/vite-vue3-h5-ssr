import type { ApiConfig, Article, ArticleStore } from '@/types'
import { acceptHMRUpdate } from 'pinia'
import api from '@/api/index-client'

export const useTopicStore = defineStore('topicStore', () => {
    const state: ArticleStore = reactive({
        lists: {
            data: [],
            hasNext: 0,
            page: 1,
            path: '',
        },
        item: {
            data: null,
            path: '',
            isLoad: false,
        },
    })

    const getTopics = async (config: ApiConfig, $api?: ApiServer | ApiClient) => {
        $api = $api || api
        if (state.lists.data.length > 0 && config.path === state.lists.path && config.page === 1) {
            return
        }
        const { code, data } = await $api.get<ResDataLists<Article>>('article/lists', { ...config, cache: true, perPage: 30 })

        if (data && code === 200) {
            let _data: Article[]
            if (config.page === 1) {
                _data = [...data.list]
            }
            else {
                _data = state.lists.data.concat(data.list)
            }

            state.lists = {
                data: _data,
                hasNext: data.hasNext,
                hasPrev: data.hasPrev,
                page: config.page || 1,
                path: config.path,
            }
        }
    }
    const getTopic = async (config: ApiConfig, $api?: ApiServer | ApiClient) => {
        $api = $api || api
        if (config.path === state.item.path) {
            return
        }
        const { code, data } = await $api.get<Article>(`article/detail/${config.id}`, { ...config, markdown: 1, cache: true })
        if (data && code === 200) {
            state.item = {
                data,
                path: config.path,
                isLoad: true,
            }
        }
    }

    return {
        ...toRefs(state),
        getTopics,
        getTopic,
    }
})

if (import.meta.hot) {
    import.meta.hot.accept(acceptHMRUpdate(useTopicStore as any, import.meta.hot))
}
