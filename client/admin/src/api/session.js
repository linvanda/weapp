// import http from '@/lib/http'
// import default from './setting';

// /**
//  * 登录
//  * @param {string} account
//  * @param {string} password
//  */
// export function login(account, password, autoLogin) {
//     return http.post('session', {
//         account,
//         password,
//         auto_login: autoLogin
//     })
// }

// /**
//  * 退出登录
//  */
// export function logout() {
//     return http.delete('session')
// }

// /**
//  * 根据 token 获取登录者信息
//  * @param {string} token
//  */
// export function loginerInfo(token) {
// 	return http.get(`session/${token}`)
// }

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
