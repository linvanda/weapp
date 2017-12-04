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
