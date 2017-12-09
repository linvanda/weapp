<template>
    <div>
        <x-list></x-list>

        
        <section class="list">
            <el-table v-loading="$store.state.loading" :data="list" stripe :default-sort="defaultSort" @sort-change="sortChange" style="width:100%">
                <el-table-column prop="account" label="账号" sortable="custom"></el-table-column>
                <el-table-column prop="name" label="名称" sortable="custom"></el-table-column>
                <el-table-column prop="mobile" label="手机"></el-table-column>
                <el-table-column label="角色">
                    <template slot-scope="scope">
                        <color-span :value="scope.row.roles" :color="color"></color-span>
                    </template>
                </el-table-column>
                <el-table-column label="操作" width="150">
                    <template slot-scope="scope">
                        <el-button type="primary" size="mini" @click="$router.push({ name: 'account-edit', params: { id: scope.row.id } })">编辑</el-button>
                        <el-button v-permit="['admin']" type="danger" size="mini" @click="deleteAccount(scope.row)">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </section>
        <section class="pagination">
            <el-pagination background layout="total, prev, pager, next" :total="total" :page-size="pageSize" :current-page.sync="page" @current-change="pageChange">
            </el-pagination>
        </section>
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
            filters: {
                account: '',
                name: '',
                mobile: '',
                role: ''
            },
            orderBy: [],
            list: [],
            total: 0,
            pageSize: 15,
            page: 1,
            color: {
                超级管理员: 'green'
            },
            roles: [],
            defaultSort: { prop: 'account', order: 'descending' }
        }
    },
    methods: {
        fetchData() {
            API.loading()
                .invoke('account.list', {
                    page: this.page,
                    pageSize: this.pageSize,
                    filters: this.filters,
                    orderBy: this.orderBy
                })
                .then(list => {
                    this.list = list.data
                    this.total = list.total
                })
        },
        fetchRoles() {
            API.invoke('permission.roles').then(roles => {
                this.roles = roles
            })
        },
        pageChange() {
            this.fetchData()
        },
        deleteAccount(row) {
            this.$confirm(`确定删除账号 ${row.account} 吗？`)
                .then(() => {
                    API.loading()
                        .invoke('account.delete', row.id)
                        .then(() => {
                            this.$message.success('删除成功')
                            this.fetchData()
                        })
                })
                .catch(() => {})
        },
        sortChange(option) {
            if (option.prop) {
                this.orderBy = [option.prop, option.order === 'descending' ? 'desc' : 'asc']
            }
        },
        resetSearch() {
            Object.keys(this.search).forEach(key => {
                const t = type(this.search[key])

                if (t === Object) {
                    this.search[key] = {}
                } else if (t === Array) {
                    this.search[key] = []
                } else {
                    this.search[key] = ''
                }
            })
        },
        doSearch() {
            this.fetchData()
        }
    },
    created() {
        this.fetchData()
        this.fetchRoles()
    },
    watch: {
        orderBy() {
            this.fetchData()
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

