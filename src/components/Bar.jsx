export default defineComponent({
    name: 'comp-header',
    props: {
        page: String
    },
    setup(props) {
        // eslint-disable-next-line no-unused-vars
        const { ctx, options, route, router, globalStore, useLockFn, useDataIsLoaded } = useGlobal('app-root')
        // 父子组件通讯 ===>
        // eslint-disable-next-line no-unused-vars
        const { page } = toRefs(props)
        // 父子组件通讯 <===
        return () => <div class="global-header">{page.value}</div>
    }
})
