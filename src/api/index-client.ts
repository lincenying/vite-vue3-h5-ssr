import axios from 'axios'
import qs from 'qs'

import type { AxiosResponse } from 'axios'
import config from './config-client'
import type { ApiClientReturn } from '@/types'

axios.interceptors.request.use(
    config => {
        return config
    },
    error => {
        return Promise.reject(error)
    }
)

axios.interceptors.response.use(
    response => response,
    error => Promise.resolve(error.response)
)

function checkStatus(response: AxiosResponse) {
    if (response && (response.status === 200 || response.status === 304)) {
        return response
    }
    return {
        data: {
            code: -404,
            message: (response && response.statusText) || '未知错误',
            data: ''
        }
    }
}

function checkCode(res: any) {
    if (res.data.code === -500) {
        window.location.href = '/backend'
    } else if (res.data.code === -400) {
        window.location.href = '/'
    } else if (res.data.code !== 200) {
        showMsg(res.data.message)
    }
    return res && res.data
}

type API = () => ApiClientReturn

/**
 * axios Api 封装
 * @returns ApiClientReturn
 * @example
 * ```
 * get(url: '/api/url', params: {}, headers: {})
 * post(url: '/api/url', data: {}, headers: {})
 * file(url: '/api/url', data: {}, headers: {})
 * ```
 */
const _api: API = () => ({
    async file(url, data) {
        const response = await axios({
            method: 'post',
            url,
            data,
            headers: {
                'X-Requested-With': 'XMLHttpRequest'
            }
        })
        const res = checkStatus(response)
        return checkCode(res)
    },
    async post(url, data) {
        const response = await axios({
            method: 'post',
            url: config.api + url,
            data: qs.stringify(data),
            timeout: config.timeout,
            headers: {
                'X-Requested-With': 'XMLHttpRequest',
                'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
            }
        })
        const res = checkStatus(response)
        return checkCode(res)
    },
    async get(url, params) {
        const response = await axios({
            method: 'get',
            url: config.api + url,
            params,
            timeout: config.timeout,
            headers: {
                'X-Requested-With': 'XMLHttpRequest'
            }
        })
        const res = checkStatus(response)
        return checkCode(res)
    }
})

export default _api()
