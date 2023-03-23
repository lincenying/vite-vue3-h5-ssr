/* eslint-disable no-unused-vars */
declare interface Window {
    $$api: {
        post: (...args) => Promise<any>
        get: (...args) => Promise<any>
        [propName: string]: (...args) => Promise<any>
    }
    __INITIAL_STATE__: any
}
