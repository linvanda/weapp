import http from '@/lib/http'

/**
 * 登录
 * @param {string} account
 * @param {string} password
 */
export function login(account, password, autoLogin) {
    return http.post('session', {
        account,
        password,
        auto_login: autoLogin
    })
}

/**
 * 退出登录
 */
export function logout() {
    return http.delete('session')
}

/**
 * 根据 token 获取登录者信息
 * @param {string} token
 */
export function loginerInfo(token) {
	return http.get(`session/${token}`)
}
