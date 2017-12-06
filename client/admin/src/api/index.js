import { Message } from 'element-ui'
import { isType, matchAll } from '@/lib/util'
import http from '@/lib/http'

/**
 * api 调用的统一入口
 */
let api = {}

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
        (url = url.replace(url, data[key])) && 
        delete data[key]
    })

    return [url, data]
}

function error(apiMsg, msg = '接口调用错误') {
    Message.error(msg)
    return Promise.reject(apiMsg)
}

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
        apiModule = require('./' + apiArr.slice(0, len - 1).join('/'))
    } catch (error) {
        return error(`no api module:${apiName}`)
    }

    let apiConfig = apiModule[apiArr[len - 1]]

    if (typeof apiConfig === 'undefined') {
        return error(`no api:${apiName}`)
    }

    try {
        // 配置处理
        apiConfig = normalizeConfig(apiConfig)
    } catch (error) {
        return error(`config error: ${error}`)
    }

    if (!apiConfig.url) {
        return error(`api no url set:${apiName}`)
    }

    // 参数处理
    try {
        params = normalizeParams(params, apiConfig.data)
    } catch (error) {
        return error(
            `params format error:${apiName}. params:${JSON.stringify(
                params
            )}. error: ${error}`
        )
    }

    // url 处理
    try {
        const [url, data] = normalizeUrl(apiConfig.url, params)

        // 发起请求
        return http[apiConfig.method](url, data, config)
    } catch (error) {
        return error(`url error.url:${apiConfig.url}.error:${error}`)
    }
}

/**
 * 打开 loading 闸口
 */
api.loading = function() {
    require('@/store').default.commit('SHOULD_LOADING', true)

    return this
}

export default api
