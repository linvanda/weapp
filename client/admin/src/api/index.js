import { Message, MessageBox } from 'element-ui'
import path from 'path'
import { empty, isType, matchAll, camelToUnderline } from '@/lib/util'
import http from '@/lib/http'

let xLoading = null
let xNoIntercept = false

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
                val.required || (val.required = false)
                typeof val.type === 'function' && (val.type = [val.type])
                val.type || (val.type = [String, Number])
            }

            // 将 Boolean 改成 Number
            val.type = val.type.map(item => {
                return item === Boolean ? Number : item
            })

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
    data = data || {}

    // 当 data 不是 Object 且 config 只有一个配置项时，该 data 就是该项的值
    if (!isType(data, Object) && Object.keys(config).length === 1) {
        data = {
            [Object.keys(config)[0]]: data
        }
    }

    // Boolean 改成 0 和 1
    Object.keys(data).forEach(key => {
        if (isType(data[key], Boolean)) {
            data[key] += 0
        }
    })

    for (const key of Object.keys(config)) {
        const cval = config[key]
        let dval = data[key]

        // 必填与默认值
        if (empty(dval, true)) {
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
 * 拦截请求，有问题则返回 Promise
 * @param {Object} response
 */
function interceptResponse(response) {
    const data = response.data
    const code = global.$conf.code
    const httpCode = response.code
    const config = response.config

    if (
        httpCode < 200 ||
        httpCode >= 300 ||
        data.constructor !== Object ||
        !data.code
    ) {
        return Promise.reject(
            Object.assign(response, { errorMsg: '服务器响应失败' })
        )
    }

    /**
     * 应用层通用错误的处理
     */
    if (!config['x-no-intercept'] && data.code !== code.OK) {
        if (data.code === code.NO_LOGIN) {
            // 未登录
            MessageBox.alert('您尚未登录或登录已过期，请重新登录', {
                callback: () => {
                    require('@/store')
                        .default.dispatch('FrontLogout')
                        .then(() => {
                            location.reload()
                            require('@/router').default.replace({
                                name: 'login'
                            })
                        })
                }
            })
        } else if (data.code === code.NO_PERMISSION) {
            // 未授权
            MessageBox.alert(data.msg || '您没有权限进行此项操作')
        } else {
            MessageBox.alert(data.msg || '抱歉，本次操作失败')
        }

        return Promise.reject(
            Object.assign(response, {
                errorMsg: data.msg || '操作失败'
            })
        )
    }

    return Promise.resolve(response)
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

    url = path.join(global.$conf.apiPrefix, url)

    // 设置 loading 状态
    let _loadingFlag = xLoading
    if (_loadingFlag) {
        store.commit('START_LOADING', _loadingFlag)
        config['x-loading'] = _loadingFlag
        xLoading = null
    }

    // 是否拦截业务错误
    config['x-no-intercept'] = xNoIntercept
    xNoIntercept = false

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
                // 响应拦截
                return interceptResponse(response).then(response => {
                    // 停止 loading
                    config['x-loading'] &&
                        config['x-loading'] === _loadingFlag &&
                        store.commit('STOP_LOADING')

                    resolve(config['x-no-intercept'] ? response.data : response.data.data)
                })
            })
            .catch(response => {
                // 停止 loading
                const config = response.config
                config['x-loading'] &&
                    config['x-loading'] === _loadingFlag &&
                    store.commit('STOP_LOADING')

                console.log('api error.url:' + url, response)
            })
    })
}

function error(apiMsg, msg = '接口调用错误') {
    Message.error(msg)

    return Promise.reject(apiMsg)
}

export default {
    // 统一调用入口
    invoke: function(apiName, params, config = {}) {
        const apiArr = apiName.split('.')
        let apiModule = null
        const len = apiArr.length

        try {
            // 模块加载
            apiModule = require('./' + apiArr.slice(0, len - 1).join('/'))
                .default
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
            return error(`params format error:${apiName}.error: ${e}`)
        }

        // url 处理
        let url
        let data
        try {
            ;[url, data] = normalizeUrl(apiConfig.url, params)
        } catch (e) {
            return error(`url error.url:${apiConfig.url}.error:${e}`)
        }

        // 发起请求
        return request(url, apiConfig.method, camelToUnderline(data), config)
    },
    // 打开 loading 闸口
    loading: function() {
        if (!require('@/store').default.state.loading) {
            xLoading = parseInt(Math.random() * 10000, 10)
        }

        return this
    },
    // 内部不要拦截业务错误码，由外界自行处理
    noIntercept: function() {
        xNoIntercept = true

        return this
    }
}
