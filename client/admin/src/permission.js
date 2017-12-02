/**
 * 前端路由：登录和授权校验
 */

 import router from '@/router'
 import store from '@/store'
 import { frontLogout, checkPermission } from '@/lib/auth'
 import { loginerInfo } from '@/api/session'

 router.beforeEach((to, from, next) => {
    const meta = to.meta

    if (meta.auth !== false) {
        // 需要登录
        if (!store.getters.logined) {
            frontLogout()
        } else {
            // 获取用户信息
            loginerInfo(store.getters.token).then((data) => {
                store.commit('SET_USERINFO', data.data)

                // 权限检查
                if (meta.roles || meta.actions) {
                    if (!checkPermission(store.state.user, meta.roles, meta.actions)) {
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
