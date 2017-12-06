/**
 * 模拟 api 数据
 */
import Mock from 'mockjs'
import URI from 'urijs'

Mock.setup({
    timeout: 1000
})

Mock.mock(/users\/[-0-9a-z]+(\?.*)?$/, 'get', options => {
    const urlArr = options.url.split('/')
    return {
        code: 1000,
        msg: 'ok',
        data: {
            id: urlArr[urlArr.length - 1],
            name: '@cname',
            account: 'lin@123.com',
            email: '@email'
        }
    }
})

Mock.mock(/session\/[-0-9a-z]+(\?.*)?$/, 'get', {
    code: 1000,
    msg: 'ok',
    data: {
        id: '12345',
        name: '@cname',
        account: 'lin@123.com',
        email: '@email',
        roles: ['admin']
    }
})

/**
 * 登录
 */
Mock.mock(/session$/, 'post', options => {
    const data = JSON.parse(options.body).params

    if (data['account'] !== 'linvanda' || data['password'] !== '123') {
        return {
            code: 1003,
            msg: '账号或密码错误'
        }
    }

    return {
        code: 1000,
        msg: 'ok',
        data: {
            token: {
                value: '123456',
                expire: '2017-12-12'
            }
        }
    }
})

/**
 * 账号列表
 */
Mock.mock(/users(\?.*)?$/, 'get', (options) => {
    let users = []
    const params = URI.parseQuery(options.url.split('?')[1])
    console.log(params)

    for (let i = 0; i < params['page_size']; i++) {
        users.push(
            Mock.mock({
                'id': '@string(32)',
                name: '@cname',
                account: '@string(8)',
                email: '@email',
                mobile: /13[0-9]{9}/,
                'roles|1': ['admin', 'editor']
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

