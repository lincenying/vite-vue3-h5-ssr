import api from '@/api/index-client'

export const useTopicStore = defineStore('topicStore', {
    state: () => {
        return {
            lists: {
                data: [],
                hasNext: 0,
                page: 1,
                path: ''
            },
            item: {
                data: {},
                path: '',
                isLoad: false
            }
        }
    },
    actions: {
        async getTopics(config, $api) {
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
                    hasNext: config.current_page < config.last_page,
                    hasPrev: config.current_page > 1,
                    page: config.page,
                    path: config.path
                }
            }
        },
        async getTopic(config, $api) {
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
