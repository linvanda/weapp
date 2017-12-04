import { empty, isAdmin, hasAny } from '@/lib/util'

/**
 * 根据指定的角色或功能点决定元素是否显示
 * @param {dom} el
 * @param {any} param1 需要的功能点或角色列表，可以是字符串、数组或对象：
 *                      字符串：单个功能点名
 *                      数组：多个功能点名，符合一个即可
 *                      对象： { roles: array|string, actions: array|string }，满足角色或功能点一个即可
 */
export default {
    inserted(el, { value }) {
        let can = false

        if (empty(value)) {
            can = true
        } else {
            const user = require('@/store').default.getters.user

            if (!empty(user) && (!empty(user.roles) || !empty(user.actions))) {
                if (isAdmin(user)) {
                    can = true
                } else {
                    let roles = []
                    let actions = []

                    if (typeof value === 'string') {
                        actions.push(value)
                    } else if (value instanceof Array) {
                        actions = value
                    } else {
                        !empty(value.roles) &&
                            (roles =
                                typeof value.roles === 'string'
                                    ? [value.roles]
                                    : value.roles)
                        !empty(value.actions) &&
                            (actions =
                                typeof value.actions === 'string'
                                    ? [value.actions]
                                    : value.actions)
                    }

                    can =
                        hasAny(user.roles, roles) ||
                        hasAny(user.actions, actions)
                }
            }
        }

        if (!can) {
            el.style.display = 'none'
        }
    }
}
