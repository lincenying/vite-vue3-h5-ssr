const state = () => ({
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
})

const actions = {
    async ['getTopics']({ commit, state, rootState: { $api } }, config) {
        if (state.lists.data.length > 0 && config.path === state.lists.path && config.page === 1) return
        const { code, data } = await $api.get('ajax/article-list', { ...config, cache: true })
        if (data && code === 200) {
            commit('receiveTopics', {
                ...config,
                ...data
            })
        }
    },
    async ['getTopic']({ commit, state, rootState: { $api } }, config) {
        if (config.path === state.item.path) return
        const { code, data } = await $api.get('ajax/article-detail', { ...config, markdown: 1, cache: true })
        if (data && code === 200) {
            commit('receiveTopic', {
                data,
                ...config
            })
        }
    }
}

const mutations = {
    ['receiveTopics'](state, { data, current_page, last_page, page, path }) {
        if (page === 1) {
            data = [].concat(data)
        } else {
            data = state.lists.data.concat(data)
        }
        state.lists = {
            data,
            hasNext: current_page < last_page,
            hasPrev: current_page > 1,
            page,
            path
        }
    },
    ['receiveTopic'](state, { data, path }) {
        state.item = {
            data,
            path,
            isLoad: true
        }
    }
}

const getters = {
    ['getTopics'](state) {
        return state.lists
    },
    ['getTopic'](state) {
        return state.item
    }
}

export default {
    namespaced: true,
    state,
    actions,
    mutations,
    getters
}
