/**
 * sources 中是否有任何符合 needs要求的
 * @param {array} needs
 * @param {array} sources
 */
export function hasAny(sources, needs) {
    if (!sources) {
        return false
    }

    sources = !(sources instanceof Array) ? [sources] : sources
    needs = !(needs instanceof Array) ? [needs] : needs

    for (const need of needs) {
        if (sources.indexOf(need) !== -1) {
            return true
        }
    }

    return false
}

/**
 * {}、null、[] 等都视为空
 * 默认情况下，0 和 false 也被认为是 empty
 * @param {object} val
 */
export function empty(val, strict = false) {
    if (strict && (val === 0 || val === false)) {
        return false
    }

    return (
        !val ||
        JSON.stringify(val) === '{}' ||
        (val instanceof Array && !val.length)
    )
}

/**
 * 用户是否超级管理员
 * @param {object} user
 */
export function isAdmin(user) {
    return (user.roles || []).indexOf(global.$conf.superRole) !== -1
}

/**
 * 类型判断
 * 注意，此判断是依据构造函数进行的，因而不要重写{Object}.prototype.constructor
 * @param {object} object
 * @param {Function|Array} types 类型构造函数，如 Array, Object, Boolean等
 */
export function isType(object, types) {
    if (typeof object === 'undefined') {
        return typeof types === 'undefined'
    }

    if (object === null) {
        return object === types
    }

    if (types.constructor === Function) {
        return object.constructor === types
    }

    for (const type of types) {
        if (object.constructor === type) {
            return true
        }
    }

    return false
}

/**
 * 获取类型
 * @param {any} object 
 */
export function type(object) {
    if (typeof object === 'undefined') {
        return undefined
    }

    if (object === null) {
        return null
    }

    return object.constructor
}

/**
 * 正则全局匹配
 * @param {RegExp} regExp
 * @param {String} text
 * @param {Number} group
 */
export function matchAll(regExp, text, group = 0) {
    if (!isType(regExp, RegExp) || !isType(text, String)) {
        return []
    }

    let result = []

    if (regExp.global) {
        let current = null
        while ((current = regExp.exec(text))) {
            result.push(current)
        }
    } else {
        result.push(regExp.exec(text))
    }

    if (typeof group === 'number') {
        return result.map(item => item[group])
    }

    return result
}

/**
 * 替换占位符，占位符以 : 开头
 * @param {string} text 
 * @param {object} data 
 */
export function replacePlaceholder(text, data) {
    if (text.indexOf(':') === -1) {
        return text
    }

    data = data || {}

    const matches = matchAll(/\/(:[-_a-zA-Z0-9]+)($|\/)/g, text, 1).sort(
        (x, y) => y.length - x.length
    )

    matches.forEach(flag => {
        const key = flag.slice(1)

        isType(data[key], [String, Number]) &&
            (text = text.replace(flag, data[key]))
    })

    return text
}

/**
 * 时间格式化
 * @param {Date|Number} time
 * @param {String} cFormat
 */
export function parseTime(time, cFormat) {
    if (arguments.length === 0) {
        return null
    }
    const format = cFormat || '{y}-{m}-{d} {h}:{i}:{s}'
    let date
    if (typeof time === 'object') {
        date = time
    } else {
        if (('' + time).length === 10) time = parseInt(time, 10) * 1000
        date = new Date(time)
    }
    const formatObj = {
        y: date.getFullYear(),
        m: date.getMonth() + 1,
        d: date.getDate(),
        h: date.getHours(),
        i: date.getMinutes(),
        s: date.getSeconds(),
        a: date.getDay()
    }
    const time_str = format.replace(/{(y|m|d|h|i|s|a)+}/g, (result, key) => {
        let value = formatObj[key]
        if (key === 'a') {
            return ['一', '二', '三', '四', '五', '六', '日'][value - 1]
        }
        if (result.length > 0 && value < 10) {
            value = '0' + value
        }
        return value || 0
    })
    return time_str
}

/**
 * 将驼峰式 key 转换为 _
 * @param {object|string} data
 */
export function camelToUnderline(data) {
    if (empty(data)) {
        return data
    }

    function _trans(key) {
        let newKey = []
        for (const c of key) {
            newKey.push(c >= 'A' && c <= 'Z' ? '_' + c.toLowerCase() : c)
        }
        return newKey.join('')
    }

    if (typeof data === 'string') {
        return _trans(data)
    }

    let result = {}

    Object.keys(data).forEach(key => {
        
        result[_trans(key)] = data[key]
    })

    return result
}
