<template>
    <div>
        <h1 class="text-red">{{ msg }}</h1>
        <Foo />
        <Bar page="我也是来自tsx" />
        <div>
            <van-button type="primary" size="small" @click="handleDialog">点击打开</van-button>
        </div>
    </div>
</template>

<script setup lang="ts">
defineOptions({
    name: 'About',
})

useHead({
    // Can be static or computed
    title: '关于',
    meta: [
        {
            name: 'description',
            content: '关于',
        },
    ],
})

const Foo = defineAsyncComponent(() => import('../components/Foo').then(mod => mod.Foo))

const msg = ref('About: SFC组件')

function handleDialog() {
    showDialog({
        title: '标题',
        message: '代码是写出来给人看的，附带能在机器上运行。',
    }).then(() => {
        // on close
    })
}
</script>
