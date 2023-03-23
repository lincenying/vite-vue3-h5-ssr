import path from 'node:path'
import { fileURLToPath } from 'node:url'

import { loadEnv, defineConfig } from 'vite'

import vuePlugin from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'

import { viteMockServe } from 'vite-plugin-mock'

import UnoCSS from 'unocss/vite'
import { createHtmlPlugin } from 'vite-plugin-html'

import VueMacros from 'unplugin-vue-macros/vite'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { VantResolver } from 'unplugin-vue-components/resolvers'

import apiDomain from './src/api/url'

export const ssrTransformCustomDir = () => {
    return {
        props: [],
        needRuntime: true
    }
}

// https://vitejs.dev/config/
export default defineConfig(({ mode, command }) => {
    const __dirname = path.dirname(fileURLToPath(import.meta.url))

    process.env = { ...process.env, ...loadEnv(mode, process.cwd()) }

    const localMock = true
    const prodMock = false

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
                    rewrite: (path: string) => path.replace(new RegExp(`^/api`), '/api')
                }
            }
        },
        css: {
            preprocessorOptions: {
                less: {
                    javascriptEnabled: true
                }
            }
        },
        plugins: [
            createHtmlPlugin({
                minify: false,
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
            viteMockServe({
                mockPath: 'mock',
                localEnabled: command === 'serve' && localMock,
                prodEnabled: command !== 'serve' && prodMock,
                injectCode: `
                  import { setupProdMockServer } from './mockProdServer';
                  setupProdMockServer();
                `,
                logger: true
            }),
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
                        '@/utils': ['deepClone', 'deepMerge', '$is', 'showMsg']
                    }
                ],
                dts: 'src/auto-imports.d.ts',
                dirs: ['src/components', 'src/composables', 'src/pinia'],

                resolvers: [VantResolver()],
                defaultExportByFilename: false,
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
                extensions: ['vue', 'tsx', 'jsx'],
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
                'vant'
                // this package has unCompiled .vue files
            ]
        }
    }
    return config
})
