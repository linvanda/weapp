/**
 * 持久化存储
 */

function fullKey(key) {
    return global.$conf.storePrefix + '_' + key
}

export default {
    set(key, value) {
        localStorage.setItem(fullKey(key), JSON.stringify(value))
    },
    get(key) {
        try {
            return localStorage[fullKey(key)] === undefined ? undefined : JSON.parse(localStorage[fullKey(key)])
        } catch (e) {
            return null
        }
    },
    remove(key) {
        localStorage.removeItem(fullKey(key))
    }
}
