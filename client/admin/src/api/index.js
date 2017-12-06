import { Message, MessageBox } from 'element-ui'
import { empty, isType, matchAll } from '@/lib/util'
import http from '@/lib/http'

/**
 * 配置处理
 * @param {any} apiConfig
 */
function normalizeConfig(apiConfig) {
    if (!apiConfig['url']) {
        throw new Error('no required property: url')
    }

    apiConfig['method'] || (apiConfig['method'] = 'get')

    if (apiConfig['data']) {
        Object.keys(apiConfig['data']).forEach(key => {
            let val = apiConfig['data'][key]

            if (typeof val === 'boolean') {
                // Boolean 类型作为 required
                val = { type: [String, Number], required: val }
            } else if (val.constructor !== Object) {
                // 非 Object 类型作为 default
                val = { type: val.constructor, default: val }
            } else {
                typeof val.type === 'function' && (val.type = [val.type])
                val.type || (val.type = [String, Number])
                val.required || (val.required = false)
            }

            apiConfig['data'][key] = val
        })
    }

    return apiConfig
}

/**
 * 参数处理
 * @param {object} config
 * @param {object} data
 */
function normalizeParams(data, config) {
    config = config || {}

    // 当 data 不是 Object 且 config 只有一个配置项时，该 data 就是该项的值
    if (!isType(data, Object) && Object.keys(config).length === 1) {
        data = {
            [Object.keys(config)[0]]: data
        }
    }

    for (const key of Object.keys(config)) {
        const cval = config[key]
        let dval = data[key]

        // 必填与默认值
        if (typeof dval === 'undefined') {
            if (
                typeof cval.required !== 'undefined' &&
                cval.required === true
            ) {
                throw new Error(`required param miss:${key}`)
            } else if (typeof cval.default !== 'undefined') {
                dval = cval.default
            }
        }

        // 类型判断
        if (!isType(dval, cval.type)) {
            throw new Error(`param type error:${key}`)
        }

        data[key] = dval
    }

    return data
}

/**
 * 处理 url 中的占位符
 * @param {String} url
 * @param {any} data
 */
function normalizeUrl(url, data) {
    if (url.indexOf(':') === -1) {
        return [url, data]
    }

    data = data || {}

    const matches = matchAll(/\/(:[-_a-zA-Z0-9]+)($|\/)/g, url, 1).sort(
        (x, y) => y.length - x.length
    )

    matches.forEach(flag => {
        const key = flag.slice(1)

        isType(data[key], [String, Number]) &&
            (url = url.replace(flag, data[key])) &&
            delete data[key]
    })

    return [url, data]
}

/**
 * 将驼峰式 key 转换为 _
 * @param {object} data
 */
function transDataIndex(data) {
    if (empty(data)) {
        return data
    }

    let result = {}

    Object.keys(data).forEach(key => {
        let newKey = []
        for (const c of key) {
            newKey.push(c >= 'A' && c <= 'Z' ? '_' + c.toLowerCase() : c)
        }
        newKey = newKey.join('')
        result[newKey] = data[key]
    })

    return result
}

/**
 * 发起请求
 * @param {String} url
 * @param {String} method
 * @param {Object} data
 * @param {Object} config
 */
function request(url, method, data, config) {
    const store = require('@/store').default
    let loadingFlag = api.loadingFlag

    // 设置 loading 状态
    console.log('==')
    if (loadingFlag) {
        console.log('0-0-')
        store.commit('START_LOADING', loadingFlag)
        config['x-loading'] = loadingFlag
        api.loadingFlag = null
    }

    return new Promise(resolve => {
        let conf = {
            url,
            method
        }

        if (method === 'get' || method === 'delete') {
            conf['params'] = data
        } else {
            conf['data'] = data
        }

        Object.assign(conf, config)
        
        http(conf)
            .then(response => {
                const data = response.data
                const code = global.$conf.code
                const httpCode = response.code
                const config = response.config

                if (httpCode < 200 || httpCode >= 300 || data.constructor !== Object || !data.code) {
                    return Promise.reject(Object.assign(response, { 'errorMsg': '服务器响应失败' }))
                }

                /**
                 * 应用层通用错误的处理
                 */
                if (data.code !== code.OK) {
                    if (data.code === code.NO_LOGIN) {
                        // 未登录
                        MessageBox.alert('您尚未登录或登录已过期，请重新登录', {
                            callback: () => {
                                require('@/lib/auth').frontLogout()
                            }
                        })
                    } else if (data.code === code.NO_PERMISSION) {
                        // 未授权
                        MessageBox.alert(data.msg || '您没有权限进行此项操作')
                    } else {
                        MessageBox.alert(data.msg || '抱歉，本次操作失败')
                    }

                    return Promise.reject(Object.assign(response, { 'errorMsg': data.msg || '操作失败' }))
                }

                // 停止 loading
                config['x-loading'] && config['x-loading'] === loadingFlag && store.commit('STOP_LOADING')

                resolve(response.data)
            })
            .catch(response => {
                // 停止 loading
                const config = response.config
                config['x-loading'] && config['x-loading'] === loadingFlag && store.commit('STOP_LOADING')
                console.log('api error:', response)
            })
    })
}

function error(apiMsg, msg = '接口调用错误') {
    Message.error(msg)
    return Promise.reject(apiMsg)
}

/**
 * api 调用的统一入口
 */
let api = { loadingFlag: null }

/**
 * 统一调用入口
 * @param {string} apiName
 * @param {any} args
 * @param {object} config
 */
api.invoke = function(apiName, params, config = {}) {
    const apiArr = apiName.split('.')
    let apiModule = null
    const len = apiArr.length

    try {
        // 模块加载
        apiModule = require('./' + apiArr.slice(0, len - 1).join('/')).default
    } catch (e) {
        return error(`no api module:${apiName}.error:${e}`)
    }

    let apiConfig = apiModule[apiArr[len - 1]]

    if (typeof apiConfig === 'undefined') {
        return error(`no api:${apiName}`)
    }

    try {
        // 配置处理
        apiConfig = normalizeConfig(apiConfig)
    } catch (e) {
        return error(`config error: ${e}`)
    }

    if (!apiConfig.url) {
        return error(`api no url set:${apiName}`)
    }

    // 参数处理
    try {
        params = normalizeParams(params, apiConfig.data)
    } catch (e) {
        return error(
            `params format error:${apiName}.error: ${e}`
        )
    }

    // url 处理
     let url
     let data
    try {
        [url, data] = normalizeUrl(apiConfig.url, params)
    } catch (e) {
        return error(`url error.url:${apiConfig.url}.error:${e}`)
    }

    // 发起请求
    return request(url, apiConfig.method, transDataIndex(data), config)
}

/**
 * 打开 loading 闸口
 */
api.loading = function() {
    if (!require('@/store').default.state.loading) {
        this.loadingFlag = parseInt(Math.random() * 10000, 10)
    }

    return this
}

export default api
