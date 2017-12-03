import Vue from 'vue'
import Router from 'vue-router'
import Layout from '@/views/layout/index'
import Manager from '@/router/modules/manager'

const _import = require('./_import_' + process.env.NODE_ENV).default

Vue.use(Router)

const router = new Router({
    routes: [
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
            title: '首页',
            redirect: '/dashboard',
            component: Layout,
            // 菜单栏图标
            icon: 'home',
            // 是否菜单栏项目。默认不是。菜单栏路由必须设置 title 或 name 属性，优先使用 title
            isMenu: true,
            children: [
                {
                    path: 'dashboard',
                    name: 'dashboard',
                    title: '面板',
                    isMenu: true,
                    component: _import('dashboard/index')
                }
            ]
        },
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
})

export default router
