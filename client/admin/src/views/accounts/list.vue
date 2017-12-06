<template>
    <div>
        <el-table v-loading="$store.state.loading" :data="list" stripe style="width:100%">
            <el-table-column prop="id" label="id" width="300"></el-table-column>
            <el-table-column prop="account" label="账号"></el-table-column>
            <el-table-column prop="name" label="名称"></el-table-column>
            <el-table-column prop="mobile" label="手机"></el-table-column>
            <el-table-column prop="roles" label="角色"></el-table-column>
            <el-table-column label="操作" width="300">
                <template slot-scope="scope">
                    <el-button type="info" size="mini">详情</el-button>
                    <el-button type="primary" size="mini">编辑</el-button>
                    <el-button type="danger" size="mini">删除</el-button>
                </template>
            </el-table-column>
        </el-table>
        <section class="pagination">
            <el-pagination 
                background 
                layout="total, prev, pager, next" 
                :total="total" 
                :page-size="pageSize" 
                :current-page.sync="currentPage"
                @current-change="pageChange">
            </el-pagination>
        </section>
    </div>
</template>

<script>
import API from '@/api'

export default {
    data() {
        return {
            list: [],
            total: 0,
            pageSize: 10,
            currentPage: 1
        }
    },
    methods: {
        fetchData() {
            API.loading().invoke('account.list', {
                page: this.currentPage, 
                pageSize: this.pageSize, 
                filters: {}
            }).then(result => {
                this.list = result.data.data
                this.total = result.data.total
            })
        },
        pageChange() {
            this.fetchData()
        }
    },
    created() {
        this.fetchData()
    }
}
</script>

<style lang="scss" scoped>
.pagination{
    padding: 20px 0;
    text-align: right;
}
</style>

