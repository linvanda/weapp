import Vue from 'vue'
import Router from 'vue-router'
import Layout from '@/views/layout/index'
import Manager from '@/router/modules/Manager'
import PublicAccount from '@/router/modules/PublicAccount'

const _import = require('./_import_' + process.env.NODE_ENV).default

Vue.use(Router)

/**
 * 除了登录、错误页面，其他路由都必须配置 title，用于正确显示菜单和面包屑
 * meta信息：
 *      auth: 是否需要登录，默认 true
 *      roles: 该路由需要的角色之一
 *      actions: 该路由需要的功能点之一。actions 和 roles 是“或”的关系
 */
export const routes = [
        {
            path: '/login',
            name: 'login',
            component: _import('login/index'),
            meta: {
                // 是否需要登录，默认需要，如果不需要登录，则显式设置为 false
                auth: false
            }
        },
        {
            path: '/',
            name: 'home',
            title: '面板',
            redirect: '/dashboard',
            component: Layout,
            // 菜单栏图标
            icon: 'fa fa-home',
            // 是否菜单栏项目。默认不是。菜单栏路由必须设置 title 或 name 属性，优先使用 title
            isMenu: true,
            children: [
                {
                    path: 'dashboard',
                    name: 'dashboard',
                    component: _import('dashboard/index')
                }
            ]
        },
        PublicAccount,
        Manager,
        {
            path: '/404',
            name: '404',
            component: _import('error/404'),
            meta: {
                auth: false
            }
        },
        {
            path: '/401',
            name: '401',
            component: _import('error/401'),
            meta: {
                auth: false
            }
        },
        {
            path: '*',
            redirect: '/404'
        }
    ]

export default new Router({ routes })
