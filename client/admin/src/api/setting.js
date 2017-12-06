/**
 * 系统设置文件
 */


// export function getSetting(userid) {
//     return http.get('admin/setting', {
//         params: { userid }
//     })
// }

export default {
    info: {
        url: 'admin/setting/:userId',
        data: {
            userId: true
        }
    }
}
