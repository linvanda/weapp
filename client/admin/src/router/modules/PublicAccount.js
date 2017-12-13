import Layout from '@/views/layout/index'
import wrapper from '@/views/layout/wrapper'
const _import = require('../_import_' + process.env.NODE_ENV).default

export default {
    path: '/public-account',
    name: 'public-account',
    title: '公众号',
    redirect: '/public-account/menu',
    component: Layout,
    isMenu: true,
    icon: 'fa fa-user-plus',
    children: [
        {
            path: 'menu',
            name: 'public-menu',
            title: '公众号菜单',
            isMenu: true,
            component: _import('public-account/menu')
        },
        {
            path: 'auto-reply',
            name: 'public-auto-reply',
            title: '自动回复',
            isMenu: true,
            component: _import('public-account/auto-reply')
        },
        {
            path: 'articles',
            name: 'public-article',
            title: '文章管理',
            isMenu: true,
            component: wrapper,
            redirect: { name: 'public-article-list' },
            children: [
                {
                    path: 'list',
                    name: 'public-article-list',
                    title: '文章列表',
                    component: _import('public-account/articles/list')
                }
            ]
        }
    ]
}
