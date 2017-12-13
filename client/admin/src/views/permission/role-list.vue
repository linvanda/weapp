<template>
    <x-list :filters="filters" :col="col" :api="api" :operations="operations"></x-list>
</template>

<script>
import XList from '@/components/XList'

export default {
    components: {
        XList
    },
    data() {
        return {
            filters: [
                { key: 'name', label: '角色名称' }
            ],
            col: [
                { key: 'label', label: '名称' },
                { key: 'users', label: '用户' }
            ],
            api: 'permission.roleList',
            operations: [
                { label: '修改 / 授权', btnType: 'primary', action: (row) => {this.$router.push({ name: 'role-edit', params: { id: row.id } })} },
                {
                    label: '删除',
                    action: row => {

                    },
                    show: row => {
                        return row.key !== global.$conf.superRole
                    }
                }
            ]
        }
    }
}
</script>
