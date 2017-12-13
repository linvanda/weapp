export default {
    // 所有角色列表
    roles: {
        url: 'roles?_type=simple'
    },
    roleList: {
        url: 'roles'
    },
    deleteRole: {
        url: 'roles/:id',
        method: 'delete',
        data: {
            id: true
        }
    }
}
