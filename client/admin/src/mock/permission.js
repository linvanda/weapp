import Mock from 'mockjs'

Mock.mock(/admin\/roles\?_type=simple/, 'get', () => {
    let roles = Mock.mock([
        {
            key: 'admin',
            name: '超级管理员',
            isAdmin: true
        },
        {
            key: 'editor',
            name: '编辑人员',
            isAdmin: false
        },
        {
            key: 'order-manager',
            label: '订单管理员',
            isAdmin: false
        },
        {
            key: 'goods-manager',
            name: '商品管理员',
            isAdmin: false
        },
        {
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

Mock.mock(/admin\/roles/, 'get', options => {
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
Mock.mock(/admin\/roles\/[^?/]+/, 'delete', {
    code: 1000
})
