import { createStore as _createStore } from 'vuex'

import topics from './modules/topics'

export function createStore() {
    return _createStore({
        namespaced: true,
        modules: {
            topics
        }
    })
}
