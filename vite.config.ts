import path from 'node:path'
import { fileURLToPath } from 'node:url'

import { defineConfig, loadEnv } from 'vite'
import vuePlugin from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import { viteMockServe } from '@lincy/vite-plugin-mock'
import UnoCSS from 'unocss/vite'
import VueMacros from 'unplugin-vue-macros'

import Components from './vite.config.components'
import Build from './vite.config.build'
import Css from './vite.config.css'

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
        plugins: [
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
        ...Build,
        ...Css,
    }
    return config
})
