/**
 * qu
 */
import store from '@/store'
import * as loginApi from '@/api/session'
import router from '@/router'
import { hasAny } from '@/lib/util'

/**
 * 登录
 * @param {string} account 
 * @param {string} password 
 */
export function login(account, password, autoLogin) {
    return loginApi.login(account, password, autoLogin).then((data) => {
        store.dispatch('Login', { token: data.data.token })
        
        // 跳转到相关页面
        router.replace(global.$conf.loginRedirectUrl)
    })
}

/**
 * 退出登录
 */
export function logout() {
    return loginApi.logout().then(() => frontLogout())
}

/**
 * 前端退出登录，用于在服务器端 token 过期的情况下使用
 */
export function frontLogout() {
    store.dispatch('Logout')

    // 跳转到登陆页
    router.replace(global.$conf.logoutRedirectUrl)
}

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
