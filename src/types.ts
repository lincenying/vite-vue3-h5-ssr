import type { AxiosInstance } from 'axios'
import type { Pinia } from 'pinia'
import type { LocationQueryValue, RouteLocationNormalized } from 'vue-router'

export interface anyArray {
    [index: number]: any
}

export type Fn = (...args: any[]) => void

export interface ApiClientReturn {
    get(url: string, params: Obj, headers?: Obj): Promise<any>
    post(url: string, data: Obj, headers?: Obj): Promise<any>
    file(url: string, data: Obj, headers?: Obj): Promise<any>
}

export interface ApiServerReturn {
    post(url: string, data: Obj, headers?: Obj): Promise<any>
    get(url: string, params: Obj, headers?: Obj): Promise<any>
    cookies: Obj
    api: AxiosInstance
    getCookies: () => Obj
}

export interface asyncDataConfig {
    store: Pinia
    route: RouteLocationNormalized
    api?: any
}

export interface ApiConfig {
    id?: LocationQueryValue | LocationQueryValue[]
    page?: number
    path?: string
    from?: string
    limit?: number
}

export interface GlobalStore {
    globalLoading: boolean
    routerLoading: boolean
    ISDEV: boolean
    ISPRE: boolean
    ISPROD: boolean
    cookies: Obj
}

export interface ListConfig {
    hasNext?: number
    hasPrev?: number
    path?: string
    page: number
    [propName: string]: any
}

export interface Article {
    c_id: string
    c_title: string
    c_content: string
}

interface ArticleStoreList extends ListConfig {
    data: Article[]
}
export interface ArticleStore {
    lists: ArticleStoreList
    item: {
        data: Nullable<Article>
        path?: string
        [propName: string]: any
    }
}
