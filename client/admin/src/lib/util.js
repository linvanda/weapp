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

    return !val || JSON.stringify(val) === '{}' || (val instanceof Array && !val.length)
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
