<template>
    <div>
        <section class="search" v-show="showSearch"></section>
        <section class="toolbar" v-show="showToolbar"></section>
        <section class="list"></section>
        <section class="pagination" v-show="showPagination"></section>
    </div>
</template>

<script>
import { empty } from '@/lib/util'

export default {
    props: {
        // api: 获取数据的 api 名称，如 user.list，api 需要的参数全部通过 search 项配置
        //      数据的返回格式： { total: 200, data: [...] }
        api: {
            type: String,
            required: true
        },
        // api 获取的数据如何呈现出来
        // { table: {...table 的配置信息，事件以 event_ 开头}, col: [...列的配置信息，key: api 返回的字段，可以空，其它：col的配置项] }
        present: {
            type: Object,
            validator(value) {
                if (empty(value) || empty(value.col)) {
                    return false
                }

                return true
            }
        },
        // 搜索配置，格式： { label: 标题, type: input|select|multiselect|daterange|range|hidden, 
        //                 data: 某些数据类型需要的数据, default: 默认值 }
        search: {
            type: Object,
            default: {}
        },
        // 分页配置
        pagination: {
            type: Object,
            default: {
                layout: 'total, prev, pager, next'
            }
        }
    },
    computed: {
        showSearch() {
            return true
        },
        showToolbar() {
            return true
        },
        showPagination() {
            return true
        }
    }
}
</script>
