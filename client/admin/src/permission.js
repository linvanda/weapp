/**
 * 前端路由：登录和授权校验
 */

 import router from '@/router'
 import store from '@/store'
 import { checkPermission } from '@/lib/auth'
 import API from '@/api'

 router.beforeEach((to, from, next) => {
    const meta = to.meta

    if (meta.auth !== false) {
        // 需要登录
        if (!store.getters.logined) {
            store.dispatch('FrontLogout').then(() => {
                // 跳转到登陆页
                location.reload()
                router.replace(global.$conf.logoutRedirectUrl)
            })
        } else {
            // 获取用户信息
            store.dispatch('LoginerInfo').then(user => {
                // 权限检查
                if (meta.roles || meta.actions) {
                    if (!checkPermission(user, meta.roles, meta.actions)) {
                        next('/401')
                    } else {
                        next()
                    }
                } else {
                    next()
                }
            })
        }
    } else {
        if (to.name === 'login' && store.getters.logined) {
            next(global.$conf.loginRedirectUrl)
        } else {
            next()
        }
    }
 })
