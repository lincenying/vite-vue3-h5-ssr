// eslint-disable-next-line no-unused-vars
import { defineComponent, onMounted, nextTick, watch, computed, toRefs, inject } from 'vue'

import useGlobal from '@/mixins/global'

export default defineComponent({
    name: 'comp-header',
    props: {
        page: String
    },
    setup(props) {
        // eslint-disable-next-line no-unused-vars
        const { ctx, options, proxy, route, router, storeToRefs, globalStore, ref, reactive, useToggle, useLockFn } = useGlobal()
        // 父子组件通讯 ===>
        // eslint-disable-next-line no-unused-vars
        const { page } = toRefs(props)
        // 父子组件通讯 <===
        return () => <div class="global-header">{page.value}</div>
    }
})
