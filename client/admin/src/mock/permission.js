import Mock from 'mockjs'

Mock.mock(/admin\/permission\/roles\?_type=simple/, 'get', () => {
    let roles = Mock.mock([
        {
            id: '@guid',
            key: 'admin',
            name: '超级管理员',
            isAdmin: true
        },
        {
            id: '@guid',
            key: 'editor',
            name: '编辑人员',
            isAdmin: false
        },
        {
            id: '@guid',
            key: 'order-manager',
            name: '订单管理员',
            isAdmin: false
        },
        {
            id: '@guid',
            key: 'goods-manager',
            name: '商品管理员',
            isAdmin: false
        },
        {
            id: '@guid',
            key: 'publisher',
            name: '发布员',
            isAdmin: false
        }
    ])

    return {
        code: 1000,
        data: roles
    }
})

Mock.mock(/admin\/permission\/roles\?.*/, 'get', options => {
    const list = Mock.mock([
        {
            id: '@guid',
            name: '超级管理员',
            key: 'admin',
            users: ['张三', '李四'],
            isAdmin: true
        },
        {
            id: '@guid',
            name: '编辑',
            key: 'editor',
            users: ['王五', '李留'],
            isAdmin: false
        }
    ])

    return {
        code: 1000,
        data: {
            total: 120,
            data: list
        }
    }
})

// 删除角色
Mock.mock(/admin\/permission\/roles\/[^?/]+/, 'delete', {
    code: 1000
})

// 角色信息
Mock.mock(/admin\/permission\/roles\/[^?/]+/, 'get', {
    code: 1000,
    data: {
        name: '编辑',
        users: [
            { id: 1, name: '张三', account: 'zhangsan' },
            { id: 24, name: '李四', account: 'lisi' },
            { id: 60, name: '王五', account: 'wangwu' }
        ],
        actions: [
            { id: '123', key: 'edit-article', name: '编辑文章' },
            { id: '124', key: 'del-article', name: '删除文章' },
            { id: '324', key: 'auto-reply', name: '自动回复' }
        ]
    }
})

Mock.mock(/admin\/permission\/actions\?_type=simple/, 'get', {
    code: 1000,
    data: [
        {
            group: '文章',
            actions: [
                { id: '123', key: 'edit-article', name: '编辑文章' },
                { id: '124', key: 'del-article', name: '删除文章' },
                { id: '125', key: 'show-article', name: '查看文章' },
                { id: '126', key: 'publish-article', name: '发布文章' }
            ]
        },
        {
            group: '公众号',
            actions: [
                { id: '223', key: 'edit-menu', name: '编辑菜单' },
                { id: '324', key: 'auto-reply', name: '自动回复' }
            ]
        }
    ]
})
