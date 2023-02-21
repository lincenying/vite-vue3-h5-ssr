import path from 'node:path'
import vueJsx from '@vitejs/plugin-vue-jsx'

import { loadEnv } from 'vite'
import vuePlugin from '@vitejs/plugin-vue'
import WindiCSS from 'vite-plugin-windicss'
// import { getBabelOutputPlugin } from '@rollup/plugin-babel'
import { createStyleImportPlugin, AndDesignVueResolve, VantResolve, ElementPlusResolve, NutuiResolve, AntdResolve } from 'vite-plugin-style-import'
import vueSetupExtend from 'vite-plugin-vue-setup-extend'

export const ssrTransformCustomDir = () => {
    return {
        props: [],
        needRuntime: true
    }
}

// https://vitejs.dev/config/
export default ({ mode, command, ssrBuild }) => {
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
            // getBabelOutputPlugin(),
            vuePlugin(),
            vueJsx(),
            vueSetupExtend(),
            {
                name: 'virtual',
                resolveId(id) {
                    if (id === '@foo') {
                        return id
                    }
                },
                load(id, options) {
                    const ssrFromOptions = options?.ssr ?? false
                    if (id === '@foo') {
                        // Force a mismatch error if ssrBuild is different from ssrFromOptions
                        return `export default { msg: '${
                            command === 'build' && !!ssrBuild !== ssrFromOptions ? `defineConfig ssrBuild !== ssr from load options` : 'hi'
                        }' }`
                    }
                }
            },
            createStyleImportPlugin({
                resolves: [AndDesignVueResolve(), VantResolve(), ElementPlusResolve(), NutuiResolve(), AntdResolve()]
            }),
            WindiCSS({
                safelist: 'prose prose-sm m-auto text-left'
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
