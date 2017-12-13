export default {
    // 所有角色列表(简洁版)
    simpleRoleList: {
        url: 'permission/roles?_type=simple'
    },
    // 角色列表（详细版，列表展示版）
    roleList: {
        url: 'permission/roles'
    },
    roleInfo: {
        url: 'permission/roles/:id',
        data: {
            id: true
        }
    },
    deleteRole: {
        url: 'permission/roles/:id',
        method: 'delete',
        data: {
            id: true
        }
    },
    simpleActionList: {
        url: 'permission/actions?_type=simple'
    }
}
