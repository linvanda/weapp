import { listConfig } from './_util'

/**
 * 账号相关 api
 */
export default {
    // 用户列表
    list: {
        url: 'users',
        // get, post, put, patch, delete，默认 get
        method: 'get',
        /**
         * type: 类型，多个类型用数组表示，默认 [String, Number]
         * default: 默认值
         * required: 是否必须，默认 false
         * validator: 验证器函数，返回 Boolean
         *
         * 简写示例：
         *      page: 1 // { type: Number, default: 1 }
         *      name: 'test' // { type: String, default: 'test' }
         *      lovers: ['red', 'blue'] // { type: Array, default: ['red', 'blue'] }
         *      autoLogin: false // { type: [String, Number], required: false }, 注意：如果需要设置 Boolean的默认值，一般采用1/0代替
         */
        data: listConfig
    },
    simpleList: {
        url: 'users?_type=simple'
    },
    // 用户信息详情
    info: {
        url: 'users/:id',
        data: {
            id: true
        }
    },
    // 删除用户
    delete: {
        url: 'users/:id',
        method: 'delete',
        data: {
            id: true
        }
    },
    // 编辑用户
    edit: {
        url: 'users/:id',
        method: 'patch',
        data: {
            id: true,
            name: true,
            email: false,
            mobile: false,
            roles: {
                type: Array,
                required: true
            }
        }
    },
    export: {
        url: 'users?_type=export'
    }
}
