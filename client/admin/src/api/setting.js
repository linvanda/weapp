/**
 * 系统设置文件
 */
import http from '@/lib/http'

export function getSetting(userid) {
    return http.get('admin/setting', {
        params: { userid }
    })
}
