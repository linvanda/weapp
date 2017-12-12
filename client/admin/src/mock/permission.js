import Mock from 'mockjs'

Mock.mock(/admin\/roles$/, 'get', () => {
    let roles = [
        {
            id: '@guid',
            key: 'admin',
            label: '超级管理员',
            isAdmin: true
        },
        {
            id: '@guid',
            key: 'editor',
            label: '编辑人员',
            isAdmin: false
        },
        {
            id: '@guid',
            key: 'order-manager',
            label: '订单管理员',
            isAdmin: false
        },
        {
            id: '@guid',
            key: 'goods-manager',
            label: '商品管理员',
            isAdmin: false
        },
        {
            id: '@guid',
            key: 'publisher',
            label: '发布员',
            isAdmin: false
        }
    ]

    return {
        code: 1000,
        data: roles
    }
})
