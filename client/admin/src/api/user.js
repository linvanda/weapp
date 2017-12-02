/**
 * 用户相关 api
 */
import http from '@/lib/http'

/**
 * 获取用户信息
 */
export function getUserInfo(userId) {
    return http.get(`users/${userId}`)
}
