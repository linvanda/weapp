/**
 * 登录授权相关
 */
import { hasAny } from '@/lib/util'

/**
 * 检查用户是否有指定对角色或权限
 * roles 和 actions 中各自只要有一个匹配即可
 * 如果同时指定了 roles 和 actions，则两者必须有匹配对
 * @param {object} user
 * @param {array} roles
 * @param {array} actions 
 */
export function checkPermission(user, roles, actions) {
    if (user.isAdmin) {
        return true
    }

    roles = roles || []
    actions = actions || []

    if (roles.length && (!user || !user.roles || !user.roles.length) || 
    actions.length && (!user || !user.actions || !user.actions.length)) {
        return false
    }

    return hasAny(user.roles, roles) || hasAny(user.actions, actions)
}
