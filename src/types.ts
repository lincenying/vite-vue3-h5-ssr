import type { Pinia } from 'pinia'
import type { LocationQueryValue, RouteLocationNormalized } from 'vue-router'

declare type Nullable<T> = T | null
// eslint-disable-next-line no-unused-vars
declare type NonNullable<T> = T extends null | undefined ? never : T

export interface anyObject {
    [propName: string]: any
}

export interface anyArray {
    [index: number]: any
}

// eslint-disable-next-line no-unused-vars
export type Fn = (...args: any[]) => void

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
