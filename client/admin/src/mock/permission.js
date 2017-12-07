import Mock from 'mockjs'

Mock.mock(/admin\/roles$/, 'get', () => {
    let roles = [
        {
            id: '@guid',
            name: 'admin',
            title: '超级管理员',
            isAdmin: true
        },
        {
            id: '@guid',
            name: 'editor',
            title: '编辑人员',
            isAdmin: false
        },
        {
            id: '@guid',
            name: 'order-manager',
            title: '订单管理员',
            isAdmin: false
        },
        {
            id: '@guid',
            name: 'goods-manager',
            title: '商品管理员',
            isAdmin: false
        }
    ]

    return {
        code: 1000,
        data: roles
    }
})
