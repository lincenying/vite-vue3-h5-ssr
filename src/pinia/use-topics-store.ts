import api from '@/api/index-client'
import type { ApiConfig, ArticleStore } from '@/types'

export const useTopicStore = defineStore('topicStore', {
    state: (): ArticleStore => {
        return {
            lists: {
                data: [],
                hasNext: 0,
                page: 1,
                path: ''
            },
            item: {
                data: null,
                path: '',
                isLoad: false
            }
        }
    },
    actions: {
        async getTopics(config: ApiConfig, $api?: any) {
            if (!import.meta.env.SSR) $api = api
            if (this.lists.data.length > 0 && config.path === this.lists.path && config.page === 1) return
            const { code, data } = await $api.get('article/lists', { ...config, cache: true, perPage: 30 })

            if (data && code === 200) {
                let _data
                if (config.page === 1) {
                    _data = [].concat(data.data)
                } else {
                    _data = this.lists.data.concat(data.data)
                }
                this.lists = {
                    data: _data,
                    hasNext: data.current_page < data.last_page ? 0 : 1,
                    hasPrev: data.current_page > 1 ? 1 : 0,
                    page: data.current_page,
                    path: config.path
                }
            }
        },
        async getTopic(config: ApiConfig, $api?: any) {
            if (!import.meta.env.SSR) $api = api
            if (config.path === this.item.path) return
            const { code, data } = await $api.get(`article/detail/${config.id}`, { ...config, markdown: 1, cache: true })
            if (data && code === 200) {
                this.item = {
                    data,
                    path: config.path,
                    isLoad: true
                }
            }
        }
    }
})
