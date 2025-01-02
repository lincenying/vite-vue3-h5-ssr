<template>
    <div>
        <h1 class="text-red">
            {{ msg }}
        </h1>
        <Foo1 />
        <Bar page="我也是来自tsx" />
        <div mt-10px>
            <van-button :loading="loading" type="primary" size="small" @click="handleDialog">
                点击打开
            </van-button>
        </div>
        <TheFooter />
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

const Foo1 = defineAsyncComponent(() => import('../components/Foo').then(mod => mod.Foo))

const msg = ref('About: SFC组件')

const loading = ref(false)

function handleDialog() {
    showDialog({
        title: '标题',
        message: '代码是写出来给人看的，附带能在机器上运行。',
    }).then(() => {
        // on close
    })
}
</script>
