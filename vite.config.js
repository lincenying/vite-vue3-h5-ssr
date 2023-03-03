import path from 'node:path'

import { loadEnv } from 'vite'

import vuePlugin from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'

import UnoCSS from 'unocss/vite'
import { createHtmlPlugin } from 'vite-plugin-html'

import VueMacros from 'unplugin-vue-macros/vite'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { VantResolver } from 'unplugin-vue-components/resolvers'

export const ssrTransformCustomDir = () => {
    return {
        props: [],
        needRuntime: true
    }
}

// https://vitejs.dev/config/
export default ({ mode }) => {
    process.env = { ...process.env, ...loadEnv(mode, process.cwd()) }

    const config = {
        css: {
            preprocessorOptions: {
                less: {
                    javascriptEnabled: true
                }
            }
        },
        plugins: [
            createHtmlPlugin({
                inject: {
                    data: {
                        VITE_APP_ENV: process.env.VITE_APP_ENV,
                        VITE_APP_API_DOMAIN: process.env.VITE_APP_API_DOMAIN,
                        VITE_APP_API: process.env.VITE_APP_API,
                        MODE: mode
                    }
                }
            }),
            VueMacros({
                plugins: {
                    vue: vuePlugin({
                        template: {
                            compilerOptions: {
                                isCustomElement: tag => ['def'].includes(tag)
                            }
                        }
                    }),
                    vueJsx: vueJsx()
                }
            }),
            // vuePlugin({
            //     reactivityTransform: true,
            //     template: {
            //         compilerOptions: {
            //             isCustomElement: tag => ['def'].includes(tag)
            //         }
            //     }
            // }),
            // vueJsx(),
            AutoImport({
                eslintrc: {
                    enabled: true
                },
                include: [
                    /\.[tj]sx?$/, // .ts, .tsx, .js, .jsx
                    /\.vue$/,
                    /\.vue\?vue/, // .vue
                    /\.md$/ // .md
                ],
                imports: [
                    'vue',
                    'vue-router',
                    '@vueuse/core',
                    '@vueuse/head',
                    {
                        pinia: ['defineStore', 'storeToRefs'],
                        'vue-router': ['createRouter', 'createWebHashHistory'],
                        vant: ['showDialog'],
                        '@/utils': ['UTC2Date', 'deepClone']
                    }
                ],
                dts: 'src/auto-imports.d.ts',
                dirs: ['src/components', 'src/pinia', 'src/mixins'],

                resolvers: [VantResolver()],
                vueTemplate: true,
                cache: false
            }),
            Components({
                include: [
                    /\.[tj]sx?$/, // .ts, .tsx, .js, .jsx
                    /\.vue$/,
                    /\.vue\?vue/, // .vue
                    /\.md$/ // .md
                ],
                resolvers: [VantResolver()],
                dts: 'src/components.d.ts'
            }),
            UnoCSS({
                /* options */
            })
        ],
        resolve: {
            alias: {
                '@': path.join(__dirname, './src')
            }
        },

        ssr: {
            noExternal: [
                // this package has uncompiled .vue files
            ]
        },
        server: {
            port: 7775,
            proxy: {
                '/api': {
                    target: 'http://php.mmxiaowu.com',
                    changeOrigin: true,
                    pathRewrite: {
                        '^/api': '/api'
                    }
                }
            }
        }
    }
    return config
}
