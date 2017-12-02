import Vue from 'vue'
import Router from 'vue-router'
import Layout from '@/views/layout/index'

const _import = require('./_import_' + process.env.NODE_ENV).default

Vue.use(Router)

const router = new Router({
    routes: [
        {
            path: '/login',
            name: 'login',
            component: _import('login/index'),
            meta: {
                auth: false,
                menu: false
            }
        },
        {
            path: '/404',
            name: '404',
            component: _import('error/404'),
            meta: {
                auth: false,
                menu: false
            }
        },
        {
            path: '/401',
            name: '401',
            component: _import('error/401'),
            meta: {
                auth: false,
                menu: false
            }
        },
        {
            path: '/',
            name: 'home',
            redirect: '/dashboard',
            component: Layout,
            icon: 'home',
            children: [
                {
                    path: 'dashboard',
                    name: 'dashboard',
                    component: _import('dashboard/index')
                }
            ]
        },
        {
            path: '*',
            redirect: '/404'
        }
    ]
})

export default router
