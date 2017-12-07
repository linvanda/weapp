import Mock from 'mockjs'
import URI from 'urijs'

Mock.setup({
    timeout: 1000
})

Mock.mock(/setting\/[^/]+$/, 'get', {
    code: 1000,
    data: {
        theme: 'purple'
    }
})
