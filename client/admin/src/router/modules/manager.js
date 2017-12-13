import Layout from '@/views/layout/index'
import wrapper from '@/views/layout/wrapper'
const _import = require('../_import_' + process.env.NODE_ENV).default

export default {
    path: '/manager',
    name: 'manager',
    title: '管理中心',
    redirect: '/manager/accounts/list',
    component: Layout,
    isMenu: true,
    icon: 'fa fa-cog',
    children: [
        /**
         * 超级管理员可以管理所有账号，其他角色只能管理自己的账号（无法删除）
         */
        {
            path: 'accounts',
            name: 'accounts',
            title: '账号管理',
            isMenu: true,
            redirect: { name: 'account-list' },
            component: wrapper,
            children: [
                {
                    path: 'list',
                    name: 'account-list',
                    title: '账号列表',
                    component: _import('accounts/list')
                },
                {
                    path: ':id',
                    name: 'account-edit',
                    title: '编辑账号',
                    props: true,
                    component: _import('accounts/edit')
                },
                {
                    path: ':id/password',
                    name: 'account-password',
                    title: '密码管理',
                    props: true,
                    component: _import('accounts/password')
                }
            ]
        },
        {
            path: 'permission',
            name: 'permission',
            title: '角色/授权',
            isMenu: true,
            component: wrapper,
            redirect: { name: 'role-list' },
            meta: {
                roles: ['admin']
            },
            children: [
                {
                    path: 'list',
                    name: 'role-list',
                    title: '角色列表',
                    component: _import('permission/role-list')
                },
                {
                    path: ':id',
                    name: 'role-edit',
                    title: '编辑角色信息',
                    component: _import('permission/role-edit')
                }
            ]
        },
        {
            path: 'setting',
            name: 'setting',
            title: '系统设置',
            isMenu: true,
            component: _import('setting/index')
        },
        {
            path: 'log',
            name: 'log',
            title: '操作日志',
            isMenu: true,
            component: _import('log/index'),
            meta: {
                roles: ['admin']
            }
        }
    ]
}
