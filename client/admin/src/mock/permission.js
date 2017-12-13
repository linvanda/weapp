import Mock from 'mockjs'

Mock.mock(/admin\/roles\?_type=simple/, 'get', () => {
    let roles = Mock.mock([
        {
            key: 'admin',
            label: '超级管理员',
            isAdmin: true
        },
        {
            key: 'editor',
            label: '编辑人员',
            isAdmin: false
        },
        {
            key: 'order-manager',
            label: '订单管理员',
            isAdmin: false
        },
        {
            key: 'goods-manager',
            label: '商品管理员',
            isAdmin: false
        },
        {
            key: 'publisher',
            label: '发布员',
            isAdmin: false
        }
    ])

    return {
        code: 1000,
        data: roles
    }
})

Mock.mock(/admin\/roles/, 'get', options => {
    const list = Mock.mock([
        {
            id: '@guid',
            label: '超级管理员',
            key: 'admin',
            users: ['张三', '李四'],
            isAdmin: true
        },
        {
            id: '@guid',
            label: '编辑',
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
