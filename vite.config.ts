import path from 'node:path'
import { fileURLToPath } from 'node:url'

import { defineConfig, loadEnv } from 'vite'

import vuePlugin from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'

import { viteMockServe } from '@lincy/vite-plugin-mock'

import UnoCSS from 'unocss/vite'

// import { createHtmlPlugin } from 'vite-plugin-html'

import VueMacros from 'unplugin-vue-macros'

import Components from './vite.config.components'
import apiDomain from './src/api/url'

export function ssrTransformCustomDir() {
    return {
        props: [],
        needRuntime: true,
    }
}

// https://vitejs.dev/config/
export default defineConfig(({ mode, command }) => {
    const __dirname = path.dirname(fileURLToPath(import.meta.url))

    process.env = { ...process.env, ...loadEnv(mode, process.cwd()) }

    const localMock = true

    const config = {
        server: {
            port: 7775,
            host: '0.0.0.0',
            hot: true,
            disableHostCheck: true,
            proxy: {
                '/api': {
                    target: apiDomain,
                    changeOrigin: true,
                    rewrite: (path: string) => path.replace(/^\/api/, '/api'),
                },
            },
        },
        css: {
            preprocessorOptions: {
                less: {
                    javascriptEnabled: true,
                },
            },
        },
        plugins: [
            // createHtmlPlugin({
            //     minify: false,
            //     inject: {
            //         data: {
            //             VITE_APP_ENV: process.env.VITE_APP_ENV,
            //             VITE_APP_API_DOMAIN: process.env.VITE_APP_API_DOMAIN,
            //             VITE_APP_API: process.env.VITE_APP_API,
            //             MODE: mode,
            //         },
            //     },
            // }),
            VueMacros.vite({
                plugins: {
                    vue: vuePlugin({
                        template: {
                            compilerOptions: {
                                isCustomElement: tag => ['def'].includes(tag),
                            },
                        },
                    }),
                    vueJsx: vueJsx(),
                },
            }),
            viteMockServe({
                mockPath: 'mock',
                enable: command === 'serve' && localMock,
                logger: true,
            }),
            ...Components(),
            UnoCSS({
                /* options */
            }),
        ],
        resolve: {
            alias: {
                '@': path.join(__dirname, './src'),
            },
        },
        ssr: {
            noExternal: [
                'vant',
                // this package has unCompiled .vue files
            ],
        },
    }
    return config
})
