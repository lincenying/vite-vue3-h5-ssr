# vite-vue3-ssr
vue3 H5端的ssr脚手架, 含asyncData里的xhr请求 (Vue3 + Vant + Pinia + Vite + TS + Unocss + SSR)

## Variations

-   [vite-nuxt3](https://github.com/lincenying/vite-nuxt3) - Nuxt3 + Vite 入门模板
-   [vite-uniapp-vue3](https://github.com/lincenying/vite-uniapp-vue3) - Uniapp3 + Vite 入门模板
-   [vite-react-mobx-ssr](https://github.com/lincenying/vite-react-mobx-ssr) - React + Mobx + Vite + SSR 入门模板
-   [vite-react-mobx](https://github.com/lincenying/vite-react-mobx) - React + Mobx + Vite 入门模板
-   [vite-react-redux](https://github.com/lincenying/vite-react-redux) - React + Redux + Vite 入门模板
-   [vite-vue3-h5-ssr](https://github.com/lincenying/vite-vue3-h5-ssr) - Vue3 + Vant + Vite + SSR 入门模板
-   [vite-vue3-h5](https://github.com/lincenying/vite-vue3-h5) - Vue3 + Vant + Vite 入门模板
-   [vite-vue3-admin](https://github.com/lincenying/vite-vue3-admin) - Vue3 + ElementPlus + Vite 管理后台入

## 使用

```bash
npx degit lincenying/vite-vue3-h5-ssr my-h5-ssr-app
cd my-h5-ssr-app
pnpm i # 如果你没有安装 pnpm，请运行：npm install -g pnpm
```

### 开发环境

```bash
pnpm serve
```

### 生产环境

```bash
pnpm build
```

### 生产环境预览

```bash
pnpm start
```

### Lint 和修复文件

```bash
pnpm lint # eslint检测不修复
pnpm lint:fix # eslint检测并修复
pnpm lint:ts # ts 类型检测
pnpm lint:css # css 检测并修复

```

## 环境变量
预留4套环境变量, 具体参数可查看根目录的 `.env.xxx`, 其中 `development` 为开发环境, `test, staging, production` 依次为 `测试环境, 预发布环境, 正式环境`
根据自己需要, 启动/编译不同的环境

## Rem 适配
设计稿相关参数配置见: `src/design.config.ts`, 按UI给的设计稿, 修改即可

设计稿宽度: `designWidth`
设计稿高度: `designHeight`
字号: `fontSize`

字号大小, 尽量配合Ui库, 比如默认使用的vant UI组件库就是设计稿宽度为375, rootfontsize为37.5
如果你的设计稿是750的, 方法有2
1: 设计稿宽度设置为750, 然后字号设置成75, 然后css代码的宽高按设计稿中实际的书写, 然后在postcss插件, 针对性判断vant的字号改成37.5( vite.config.css.ts 里已做了适配vant组件库)
2: 设计稿宽度设置为375, 然后字号设置成37.5, 然后css代码的宽高按设计稿中实际尺寸/2书写, 也可以将设计稿尺寸调整到375后, 按375的实际尺寸书写

一般项目中有3类代码的单位需要转换, 分别是自己写的css代码, 组件库或者其他第三方插件带的css代码, 使用unocss写的原子化css
具体插件配置详见: `vite.config.css.ts`

## 自动引入UI库组件/项目组件/函数等

项目已经配置了`unplugin-auto-import`和`unplugin-vue-components`
前者能自动引入vue, vue-router, vueuse等提供的方法, 而无需一遍遍的`import`
后者能自动引入UI组件, 及项目被定义的组件, 也不用一遍遍的`import`
详细配置见: `vite.config.components.ts`
相关文档见:
https://github.com/antfu/unplugin-auto-import#readme
https://github.com/antfu/unplugin-vue-components#readme

## Pinia 状态管理
vue 官方出品的, 比vuex更好用的状态管理, 在ssr版本中, 页面加载的数据将由pinia管理
使用方法:
在pinia文件夹下,新建一个ts文件, 如: `use-global-store.ts`
里面代码如下:
```ts
import type { GlobalState } from './pinia.types'

const useStore = defineStore('globalStore', () => {
    const state: GlobalState = reactive({
        globalLoading: true,
        routerLoading: false,
    })

    const setGlobalLoading = (payload: boolean) => {
        state.globalLoading = payload
    }
    const setRouterLoading = (payload: boolean) => {
        state.routerLoading = payload
    }

    return {
        ...toRefs(state),
        setGlobalLoading,
        setRouterLoading,
    }
})

export default useStore
```

那么在需要用到该状态管理的地方, 只需要
```ts
const userStore = useGlobalStore()
userStore.setGlobalLoading(true)
```

如果是需要ssr渲染则需要:
```ts
defineOptions({
    name: 'Home',
    asyncData(payload: asyncDataConfig) {
        const { store, route, api } = payload
        const topicStore = useTopicStore(store) // ssr端, 必须将Pinia实例传入
        return topicStore.getTopics({ path: route.fullPath, page: 1 }, api)
    },
})

const topicStore = useTopicStore() // 客服端, 无需传Pinia实例
const { lists } = $(storeToRefs(topicStore))
```
其中`asyncData`方法为给node端使用, 最后两句为给浏览器端使用, 其中`asyncData`参数`payload`包含`store`(Pinia实例), `route`(当前路由数据), `api`(xhr封装), `req`(express的Request), 详见`entry-server.ts`

即可, 因为配置了`unplugin-auto-import`, 所以根本无需要`import`, 你只需要直接把文件名改成驼峰的方式, 直接当函数使用即可
注意: 直接用文件名当函数名, 只有代码是用`export default`导出时可用, 如果是用`export const xxx`, `export function xxx {}` 这样导出的, 那么直接使用xxx作为方法名即可
具体可以看`src/auto-imports.d.ts`为你生成了那些方法, 这里的方法都可以直接使用, 而无需`import`

## 路由
放在`views`文件夹下的`vue`文件, 都会自动加入路由中, 子文件夹里的则不会, 根据你自己的使用情况, 可以修改`src/router/index.ts`以适配
是使用`hash`还是`history`模式, 也可以在上面的文件中修改

## Api封装
`src/api/index-client.ts`, `src/api/index-server.ts`封装了`get, post`2中常用的方法, 其中`index-client.ts`为浏览器端使用, `index-server.ts`为node端使用

接口默认判断code=200为正常返回, 如果后端接口不是用code作为判断, 那么需要在`src/api/index.ts`做对应修改
如:
```ts
let detail: NullAble<Article> = null
async function getDetail() {
    const { code, data } = await $api.get<Article>('article/detail', {})
    if (code === 200) {
        detail = data
    }
}

getDetail()
```

## 开发环境配置proxy跨域
```
{
    server: {
        port: 7771,
        proxy: {
            '/api': {
                target: 'https://php.mmxiaowu.com',
                changeOrigin: true,
                rewrite: (path: string) => path.replace(/^\/api/, '/api'),
            },
        },
    },
}
```
详见: `vite.config.build.ts`

## Mock
在`mock`文件夹, 创建ts文件, 按mock规则添加接口即可, 详情见: `mock/module-index.ts`
相关文档见:
https://github.com/anncwb/vite-plugin-mock/tree/master/#readme

## Unocss
unocss是一个及时/按需/原子化的css引擎, 项目中也做了相关配置, 可直接使用
配置见:
https://github.com/lincenying/base-config/blob/main/src/uno.h5.config.ts
官方文档见:
https://unocss.dev/

## eslint/stylelint/prettierrc/vue-tsc
根目录下的`.eslintrc.json`、`.stylelintrc.json`、`.prettier`内置了 lint 规则，帮助你规范地开发代码，有助于提高团队的代码质量和协作性，可以根据团队的规则进行修改
注意: `prettier`只在编辑器层面, 在`eslint`中并没有添加`prettier`插件

## License

[MIT]
