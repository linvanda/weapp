export default {
    login: {
        url: 'session',
        method: 'post',
        data: {
            // 简写：当 value 为 Boolean 类型时，表示 { type: [String, Number], required: true|false }
            account: true,
            password: true,
            autoLogin: {
                type: Boolean,
                default: false
            }
        }
    },
    logout: {
        url: 'session',
        method: 'delete'
    },
    loginerInfo: {
        url: 'session/:token',
        data: {
            token: true
        }
    }
}
