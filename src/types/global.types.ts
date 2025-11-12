import type { Pinia } from 'pinia'
import type { LocationQueryValue } from 'vue-router'

export interface AnyArray {
    [index: number]: any
}

export interface RenderType {
    html: string
    preloadLinks: string
    headTags: string
    store: Pinia
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
    cookies: Objable
}

export interface ListConfig {
    hasNext?: number | boolean
    hasPrev?: number | boolean
    path?: string
    page: number
    [propName: string]: any
}
