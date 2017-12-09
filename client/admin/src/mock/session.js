import Mock from 'mockjs'

// Mock.setup({
//     timeout: 1000
// })

/**
 * 获取登陆者信息
 */
Mock.mock(/session\/[-0-9a-z]+(\?.*)?$/, 'get', {
    code: 1000,
    msg: 'ok',
    data: {
        id: '12345',
        name: '@cname',
        account: 'lin@123.com',
        email: '@email',
        'roles|1': [ 'admin']
    }
})

/**
 * 登录
 */
Mock.mock(/session$/, 'post', options => {
    const data = JSON.parse(options.body)

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
 * 退出登录
 */
Mock.mock(/session$/, 'delete', {
    code: 1000
})
