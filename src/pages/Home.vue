<template>
    <div class="flex flex-col">
        <h1>Home</h1>
        <p>
            <img src="../assets/logo.png" alt="logo" />
        </p>
        <button @click="state.count++">count is: {{ state.count }}</button>
    </div>
</template>

<script setup>
/* eslint-disable no-unused-vars */
import { reactive } from 'vue'

const state = reactive({ count: 0 })
</script>

<style scoped>
h1,
a {
    color: green;
}
</style>
