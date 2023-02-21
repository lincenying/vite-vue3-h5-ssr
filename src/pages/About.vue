<template>
    <div>
        <h1>{{ msg }}</h1>
        <Foo></Foo>
        <div><el-button @click="handleDialog">点击打开 Message Box</el-button></div>
    </div>
</template>

<script>
import { defineAsyncComponent } from 'vue'
import { useHead } from '@vueuse/head'

import useGlobal from '@/mixins/global'

export default {}
</script>
<script setup name="about">
// eslint-disable-next-line no-unused-vars
const { ctx, options, proxy, route, router, storeToRefs, globalStore, ref, reactive, useToggle, useLockFn } = useGlobal()

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
    ctx.$alert('这是一段内容', '标题名称', {
        confirmButtonText: '确定',
        callback: action => {
            ctx.$message({
                type: 'info',
                message: `action: ${action}`
            })
        }
    })
}
</script>

<style scoped>
h1 {
    color: red;
}
</style>
