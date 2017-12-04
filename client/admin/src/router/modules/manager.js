import Layout from '@/views/layout/index'
const _import = require('../_import_' + process.env.NODE_ENV).default

export default {
    path: '/manager',
    name: 'manager',
    title: '管理中心',
    redirect: '/manager/accounts/list',
    component: Layout,
    isMenu: true,
    children: [
        /**
         * 超级管理员可以管理所有账号，其他角色只能管理自己的账号（无法删除）
         */
        {
            path: 'accounts',
            name: 'accounts',
            title: '账号管理',
            isMenu: true,
            redirect: '/manager/accounts/list',
            component: _import('accounts/index'),
            children: [
                {
                    path: 'list',
                    name: 'account-list',
                    title: '账号列表',
                    component: _import('accounts/list')
                },
                {
                    path: ':id',
                    name: 'account-detail',
                    title: '账号详情',
                    props: true,
                    component: _import('accounts/detail')
                },
                {
                    path: ':id/password',
                    name: 'account-password',
                    title: '密码管理',
                    props: true,
                    component: _import('accounts/password')
                }
            ]
        }
    ]
}
