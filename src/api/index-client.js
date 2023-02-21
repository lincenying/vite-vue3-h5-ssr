import axios from 'axios'
import qs from 'qs'
import config from './config-client'

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

function checkStatus(response) {
    if (response && (response.status === 200 || response.status === 304)) {
        return response
    }
    return {
        data: {
            code: -404,
            message: response.statusText,
            data: ''
        }
    }
}

function checkCode(res) {
    return res && res.data
}

export default {
    async file(url, data) {
        const res = await axios({
            method: 'post',
            url,
            data,
            headers: {
                'X-Requested-With': 'XMLHttpRequest'
            }
        })
        return checkCode(checkStatus(res))
    },
    async post(url, data) {
        const res = await axios({
            method: 'post',
            url: config.api + url,
            data: qs.stringify(data),
            timeout: config.timeout,
            headers: {
                'X-Requested-With': 'XMLHttpRequest',
                'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
            }
        })
        return checkCode(checkStatus(res))
    },
    async get(url, params) {
        const res = await axios({
            method: 'get',
            url: config.api + url,
            params,
            timeout: config.timeout,
            headers: {
                'X-Requested-With': 'XMLHttpRequest'
            }
        })
        return checkCode(checkStatus(res))
    }
}
