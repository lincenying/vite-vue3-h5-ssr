<template>
    <div>
        <h1 class="text-red">{{ msg }}</h1>
        <Foo></Foo>
        <Bar page="我也是来自jsx"></Bar>
        <div>
            <van-button @click="handleDialog" type="primary" size="small">点击打开</van-button>
        </div>
    </div>
</template>

<script setup>
import Bar from '../components/Bar'

defineOptions({
    name: 'about'
})

// eslint-disable-next-line no-unused-vars
const { ctx, options, route, router, globalStore, useLockFn, useDataIsLoaded } = useGlobal('app-root')

useHead({
    // Can be static or computed
    title: '关于',
    meta: [
        {
            name: `description`,
            content: '关于'
        }
    ]
})

const Foo = defineAsyncComponent(() => import('../components/Foo').then(mod => mod.Foo))

const msg = ref('About: SFC组件')

const handleDialog = () => {
    showDialog({
        title: '标题',
        message: '代码是写出来给人看的，附带能在机器上运行。'
    }).then(() => {
        // on close
    })
}
</script>
