<template>
    <div>
        <x-search v-if="filters && filters.length" :items.sync="innerFilters" @search="search"></x-search>
        <x-toolbar v-if="toolbar && toolbar.length" :items="toolbar" @click="toolbarClick"></x-toolbar>
        <section class="list">
            <!-- 主体数据列表 -->
            <el-table v-loading="$store.state.loading" :data="list" border @selection-change="selectionChange" @sort-change="sortChange" style="width:100%">
                <el-table-column v-if="col[0].type && ['index', 'selection'].indexOf(col[0].type) !== -1" :type="col[0].type"></el-table-column>
                <el-table-column 
                    v-for="(item, index) in col.slice(col[0].type ? 1 : 0)" 
                    :key="index" 
                    :type="item.type || ''" 
                    :width="item.width || ''"
                    :sortable="item.sortable ? 'custom' : false"
                    :label="item.label || ''"
                    :header-align="item.sub ? 'center' : 'left'"
                    :prop="item.key || ''"
                    >
                        <template v-if="item.key && !item.type" slot-scope="scope">
                            <color-span v-if="item.color" :value="item.format && item.format(scope.row, item.key) || scope.row[item.key]" :color="item.color"></color-span>
                            <router-link v-else-if="item.link" :to="typeof item.link === 'function' ? item.link(scope.row) : item.link">
                                {{ (item.format && item.format(scope.row, item.key) || scope.row[item.key]) | join }}
                            </router-link>
                            <span v-else>
                                {{ (item.format && item.format(scope.row, item.key) || scope.row[item.key]) | join }}
                            </span>
                        </template>
                        <!-- 二级标题，结构和一级相同 -->
                        <template v-if="item.sub && item.sub.length">
                            <el-table-column 
                                v-for="(sub, key) in item.sub" 
                                :key="'sub_' + key"
                                :type="sub.type || ''"
                                :width="sub.width || ''"
                                :sortable="sub.sortable ? 'custom' : false"
                                :prop="sub.key"
                                :label="sub.label"
                                >
                                    <template v-if="sub.key" slot-scope="scope">
                                        <color-span v-if="sub.color" :value="sub.format && sub.format(scope.row, sub.key) || scope.row[sub.key]" :color="sub.color"></color-span>
                                        <router-link v-else-if="sub.link" :to="typeof sub.link === 'function' ? sub.link(scope.row) : sub.link">
                                            {{ (sub.format && sub.format(scope.row, sub.key) || scope.row[sub.key]) | join }}
                                        </router-link>
                                        <span v-else>{{ (sub.format && sub.format(scope.row, sub.key) || scope.row[sub.key]) | join }}</span>
                                    </template>
                            </el-table-column>
                        </template>
                </el-table-column>
                <!-- 操作按钮 -->
                <el-table-column v-if="operations && operations.length" label="操作">
                    <template slot-scope="scope">
                        <x-operation v-for="(cfg, key) in operations" :key="key" :config="cfg" :row="scope.row" @done="operationDone"></x-operation>
                    </template>
                </el-table-column>
            </el-table>
        </section>
        <section v-if="pagination" class="pagination">
            <el-pagination background layout="total, prev, pager, next" :total="total" :page-size="pageSize" :current-page.sync="page" @current-change="pageChange">
        </el-pagination>
        </section>
    </div>
</template>

<script>
import XSearch from './_list/search'
import XToolbar from './_list/toolbar'
import XOperation from './_list/operation'
import XRegion from './Region'
import ColorSpan from './ColorSpan'
import API from '@/api'

export default {
    components: {
        XSearch,
        XToolbar,
        XOperation,
        XRegion,
        ColorSpan
    },
    props: {
        filters: {
            type: Array
        },
        toolbar: {
            type: Array
        },
        defaultSort: {
            type: Array
        },
        // 列配置
        col: {
            type: Array,
            required: true
        },
        // 每列的操作按钮组
        operations: {
            type: Array
        },
        // 主数据请求 api
        api: {
            type: [String, Array],
            required: true
        },
        // 是否分页
        pagination: {
            type: Boolean,
            default: true
        },
        pageSize: {
            type: Number,
            default: 15
        }
    },
    data() {
        return {
            total: 0,
            list: [],
            orderBy: this.defaultSort || [],
            page: 1,
            innerFilters: this.filters
        }
    },
    methods: {
        toolbarClick(item) {
            // toolbar 点击
            if (item.type === 'export' && !item.action && item.api) {
                // 执行默认的导出行为
                this.export(item)
            } else if (item.action) {
                item.action(this)
            }
        },
        // 导出 excel
        export(item) {
            if (item.api) {
                API.doing().invoke(item.api, {
                    filters: this.filterDatas()
                })
            }
        },
        search() {
            this.fetchData()
        },
        sortChange(option) {
            if (option.prop) {
                this.orderBy = [option.prop, option.order === 'descending' ? 'desc' : 'asc']
                this.fetchData()
            }
        },
        fetchData() {
            API.loading()
                .invoke(this.api, {
                    page: this.page,
                    pageSize: this.pageSize,
                    filters: this.filterDatas(),
                    orderBy: this.orderBy
                })
                .then(list => {
                    this.list = list.data
                    this.total = list.total
                })
        },
        filterDatas() {
            let obj = {}
            this.innerFilters.forEach(filter => {
                obj[filter.key] = typeof filter.value === 'undefined' ? '' : filter.value

                // 区间特殊处理
                if (filter.type === 'range') {
                    obj[filter.key] = this.regulateRange(obj[filter.key])
                }
            })
            return obj
        },
        regulateRange(range) {
            if (range.indexOf('' !== -1)) {
                return range
            }

            return [Math.min(range), Math.max(range)]
        },
        pageChange() {
            this.fetchData()
        },
        selectionChange(vals) {
            this.$emit('selection-change', vals)
        },
        operationDone(result, cfg) {
            if (cfg.type && cfg.type === 'delete') {
                this.fetchData()
            }
        }
    },
    created() {
        this.fetchData()
    }
}
</script>

<style lang="scss" scoped>
.pagination {
    padding: 20px 0;
    text-align: right;
}
</style>
