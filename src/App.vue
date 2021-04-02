<template>
    <div class="main">
        <div class="header">
            <router-link :to="`/`">HOME</router-link>
            <router-link :to="`/about`">ABOUT</router-link>
        </div>
        <div class="body">
            <router-view v-slot="{ Component }">
                <Suspense>
                    <component :is="Component" />
                </Suspense>
            </router-view>
        </div>
    </div>
</template>

<style>
#app {
    margin: 20px 0;
}
</style>
