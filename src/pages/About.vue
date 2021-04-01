<template>
    <h1>{{ msg }}</h1>
</template>

<script>
import { useHead } from '@vueuse/head'

export default {
    async setup() {
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
        return {
            msg: 'About'
        }
    }
}
</script>

<style scoped>
h1 {
    color: red;
}
</style>
