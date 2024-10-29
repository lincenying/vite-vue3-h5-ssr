import axios from 'axios'
import md5 from 'md5'
import qs from 'qs'
import config from './config-server'

function objToStr(cookies: Record<string, string | number | boolean>) {
    if (!cookies) {
        return ''
    }
    let cookie = ''
    Object.keys(cookies).forEach((item) => {
        cookie += `${item}=${cookies[item]}; `
    })
    return cookie
}

export default {}

export function api(cookies: Record<string, any>): ApiServer {
    return {
        cookies,
        api: axios.create({
            baseURL: config.api,
            headers: {
                'X-Requested-With': 'XMLHttpRequest',
                'cookie': objToStr(cookies),
            },
            timeout: config.timeout,
        }),
        getCookies() {
            return this.cookies
        },
        async post(url, data, headers = {}) {
            const cookies = this.getCookies() || {}
            const username = cookies.username || ''
            const key = md5(url + JSON.stringify(data) + username)
            if (config.cached && data.cache && config.cached.has(key)) {
                const res = config.cached.get(key)
                return Promise.resolve(res && res.data)
            }
            const res_1 = await this.api({
                method: 'post',
                url,
                data: qs.stringify(data),
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
                    ...headers,
                },
            })
            if (config.cached && data.cache) {
                config.cached.set(key, res_1)
            }
            return res_1 && res_1.data
        },
        async get(url, params, headers = {}) {
            const cookies = this.getCookies() || {}
            const username = cookies.username || ''
            const key = md5(url + JSON.stringify(params) + username)
            if (config.cached && params.cache && config.cached.has(key)) {
                const res = config.cached.get(key)
                return Promise.resolve(res && res.data)
            }
            return this.api({
                method: 'get',
                url,
                params,
                headers: {
                    ...headers,
                },
            }).then((res) => {
                if (config.cached && params.cache) {
                    config.cached.set(key, res)
                }
                return res && res.data
            })
        },
    }
}
