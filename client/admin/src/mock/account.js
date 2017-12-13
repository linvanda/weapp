import Mock from 'mockjs'
import URI from 'urijs'
import _ from 'lodash'

Mock.setup({
    timeout: 500
})

/**
 * 用户信息详情
 */
Mock.mock(/users\/[-0-9a-z]+(\?.*)?$/, 'get', options => {
    const urlArr = options.url.split('/')
    return {
        code: 1000,
        msg: 'ok',
        data: Mock.mock({
            id: urlArr[urlArr.length - 1],
            name: '@cname',
            account: 'lin@123.com',
            email: '@email',
            mobile: /13[0-9]{9}/,
            roles: ['editor', 'publisher']
        })
    }
})

/**
 * 导出
 */
Mock.mock(/users?_type=export/, 'get', () => {
    return {
        code: 1000
    }
})

/**
 * 账号列表
 */
Mock.mock(/users(\?.*)?$/, 'get', (options) => {
    let users = []
    const params = URI.parseQuery(options.url.split('?')[1])

    for (let i = 0; i < params['page_size']; i++) {
        users.push(
            Mock.mock({
                'id': '@string("abcdefg",32)',
                name: '@cname',
                account: '@string(8)',
                email: '@email',
                mobile: /13[0-9]{9}/,
                'roles|1-2': () => {
                    const arr = [
                        { key: 'admin', name: '超级管理员' },
                        { key: 'editor', name: '编辑' },
                        { key: 'order-manager', name: '订单管理员' }
                    ]
                    let newArr = []
                    for (const i of _.range(_.random(1, 3))) {
                        newArr.push(arr[_.random(0, 2)])
                    }

                    return newArr
                }
            })
        )
    }

    return {
        code: 1000,
        data: {
            total: 1200,
            data: users
        }
    }
})

/**
 * 删除账号
 */
Mock.mock(/users\/[^/]+$/, 'delete', () => ({ code: 1000 }))

/**
 * 编辑账号
 */
Mock.mock(/users\/[^/]+$/, 'patch', () => {
    return {
        code: 1000
    }
})
