<template>
    <div>
        <x-list :filters="filters" :toolbar="toolbar" :col="col" :operations="operations" :api="api" :default-sort="defaultSort" @selection-change="selectionChange"></x-list>
    </div>
</template>

<script>
import API from '@/api'
import ColorSpan from '@/components/ColorSpan'
import { type } from '@/lib/util'
import XList from '@/components/List'

export default {
    components: {
        ColorSpan,
        XList
    },
    data() {
        return {
            filters: [
                { key: 'account', label: '账号' }, // 输入框、默认空字符串
                {
                    key: 'name',
                    type: 'input',
                    label: '姓名',
                    placeholder: '请输入姓名',
                    value: ''
                },
                {
                    key: 'role',
                    label: '角色',
                    type: 'select', // 单选下拉
                    placeholder: '选择角色',
                    data: [
                        { key: 'admin', label: '超级管理员' },
                        { key: 'editor', label: '编辑人员' }
                    ],
                    value: ''
                },
                {
                    key: 'love',
                    type: 'multiselect',
                    label: '爱好',
                    data: [
                        { key: 'boll', label: '打球' },
                        { key: 'mount', label: '爬山' }
                    ],
                    value: []
                },
                {
                    key: 'score',
                    label: '积分',
                    type: 'range' // 数字范围
                    // value: [1, 9]
                },
                {
                    key: 'date',
                    label: '注册日期',
                    type: 'daterange' // 日期范围
                    // value: ['2010-09-12', '2019-09-19'] // 日期字符串
                },
                {
                    key: 'region',
                    label: '地区',
                    type: 'region',
                    // value: [],
                    level: 3,
                    pickAnyLevel: false
                },
                {
                    key: 'type',
                    type: 'hidden',
                    value: [1, 2]
                }
            ],
            toolbar: [
                {
                    key: 'custom',
                    type: 'button',
                    label: '自定义',
                    buttonType: 'default',
                    permission: ['admin'],
                    action(vm) {
                        //
                    }
                },
                {
                    type: 'export',
                    api: 'account.export'
                }
            ],
            col: [
                { type: 'selection' },
                { key: 'account', label: '账号', sortable: true },
                { key: 'name', label: '姓名', format(row, colKey) {return `${row[colKey]}(${row['mobile']})`} },
                { 
                    label: '联系方式', 
                    sub: [
                        { key: 'mobile', label: '手机' },
                        { key: 'email', label: '邮箱', color: 'orange' }
                    ]
                },
                { key: 'roles', label: '角色', color: { '超级管理员': 'green', '发布员': 'blue', '_': 'gray' } }
            ],
            operations: [
                { 
                    label: '编辑', 
                    type: 'primary', 
                    action: (row) => {
                        this.$router.push({ name: 'account-edit', params: { id: row.id } })
                    } 
                },
                {
                    label: '删除',
                    type: 'danger',
                    permission: ['admin'],
                    action: (row, vm) => {
                        this.$confirm(`确定删除账号 ${row.account} 吗？`)
                        .then(() => {
                            API.loading()
                                .invoke('account.delete', row.id)
                                .then(() => {
                                    this.$message.success('删除成功')
                                    vm.fetchData()
                                })
                        })
                        .catch(() => {})
                    }
                }
            ],
            api: 'account.list',
            defaultSort: ['account', 'desc']
            
        }
    },
    methods: {
        selectionChange(vals) {
            // console.log('=', vals)
        }
    }
}
</script>

<style lang="scss" scoped>
.pagination {
    padding: 20px 0;
    text-align: right;
}
.search {
    padding-bottom: 30px;
    .search-btn {
        margin-left: 40px;
    }
}
</style>

