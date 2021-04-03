<template>
    <div>
        <h1>{{ msg }}</h1>
        <div><el-button type="text" @click="handleDialog">点击打开 Message Box</el-button></div>
    </div>
</template>

<script>
import { ref, getCurrentInstance } from 'vue'
import { useHead } from '@vueuse/head'

export default {
    async setup() {
        const { ctx } = getCurrentInstance()

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

        const msg = ref('About')
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
        return {
            msg,
            handleDialog
        }
    }
}
</script>

<style scoped>
h1 {
    color: red;
}
</style>
