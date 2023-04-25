import { acceptHMRUpdate } from 'pinia'
import api from '@/api/index-client'
import type { ApiClientReturn, ApiConfig, ApiServerReturn, ArticleStore } from '@/types'

export const useTopicStore = defineStore('topicStore', () => {
    const state = reactive<ArticleStore>({
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

    const getTopics = async (config: ApiConfig, $api?: ApiServerReturn | ApiClientReturn) => {
        if (!import.meta.env.SSR)
            $api = api
        if (state.lists.data.length > 0 && config.path === state.lists.path && config.page === 1)
            return
        const { code, data } = await $api!.get('article/lists', { ...config, cache: true, perPage: 30 })

        if (data && code === 200) {
            let _data
            if (config.page === 1)
                _data = [].concat(data.data)
            else
                _data = state.lists.data.concat(data.data)

            state.lists = {
                data: _data,
                hasNext: data.current_page < data.last_page ? 0 : 1,
                hasPrev: data.current_page > 1 ? 1 : 0,
                page: data.current_page,
                path: config.path,
            }
        }
    }
    const getTopic = async (config: ApiConfig, $api?: ApiServerReturn | ApiClientReturn) => {
        if (!import.meta.env.SSR)
            $api = api
        if (config.path === state.item.path)
            return
        const { code, data } = await $api!.get(`article/detail/${config.id}`, { ...config, markdown: 1, cache: true })
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

if (import.meta.hot)
    import.meta.hot.accept(acceptHMRUpdate(useTopicStore as any, import.meta.hot))
