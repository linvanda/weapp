import Mock from 'mockjs'

// Mock.setup({
//     timeout: 1000
// })

Mock.mock(/setting\/[^/]+$/, 'get', {
    code: 1000,
    data: {
        theme: 'blue'
    }
})
