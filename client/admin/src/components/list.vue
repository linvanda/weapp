<template>
    <div>
        <x-search v-if="filters && filters.length" :items.sync="filters" @search="search"></x-search>
        <x-toolbar v-if="toolbar && toolbar.length" :items="toolbar" @click="toolbarClick"></x-toolbar>
    </div>
</template>

<script>
import XSearch from './_list/search'
import XToolbar from './_list/toolbar'
import XRegion from './Region'

export default {
    components: {
        XSearch,
        XToolbar,
        XRegion
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
                    type: 'range', // 数字范围
                    // value: [1, 9]
                },
                {
                    key: 'date',
                    label: '注册日期',
                    type: 'daterange', // 日期范围
                    // value: ['2010-09-12', '2019-09-19'] // 日期字符串
                },
                {
                    key: 'region',
                    label: '地区',
                    type: 'region',
                    // value: [],
                    level: 3,
                    pickAnyLevel: false
                }
            ],
            toolbar: [
                {
                    key: 'custom',
                    type: 'button',
                    label: '自定义',
                    buttonType: 'default',
                    permission: ['admin']
                },
                {
                    type: 'export'
                }
            ]
        }
    },
    methods: {
        toolbarClick(key) {
            // toolbar 点击
        },
        search() {
            // 搜索
            console.log('=-=', this.filters)
        },
        test() {

        }
    },
    watch: {
        filters(val) {
            console.log('filter:', val)
        }
    }
}
</script>
