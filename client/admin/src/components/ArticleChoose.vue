<template>
    <el-dialog width="60%" :title="title" :visible="visible" @open="open" @close="cancel" :close-on-click-modal="false" :close-on-press-escape="true">
        <div v-loading="$store.state.loading" class="body">
            <div class="header">
                <el-form inline size="small">
                    <el-form-item>
                        <el-input v-model="filters.title" placeholder="输入图文标题搜索"></el-input>
                    </el-form-item>
                    <el-form-item><el-button @click="search">搜索</el-button></el-form-item>
                </el-form>
            </div>
            <el-row :gutter="gutter" class="content">
                <el-col :span="24/col" v-for="article in articles" :key="article.id">
                    <x-card 
                        class="article-card"
                        :image="article.image" 
                        :title="article.title" 
                        :tip="article.date" 
                        :mask="innerSelectedArticles.some(item => item.id === article.id)" 
                        :hasRadius="false"
                        @click.native="clickCard(article)">
                    </x-card>
                </el-col>
                <el-col :span="24" v-if="!articles.length" class="empty">暂无数据</el-col>
            </el-row>
            <div class="footer">
                <el-pagination layout="total, prev, pager, next" :total="total" :page-size="pageSize" :current-page.sync="page" @current-change="pageChange">
                </el-pagination>
            </div>
        </div>
        <div slot="footer" class="dialog-footer">
            <el-button @click="cancel">取 消</el-button>
            <el-button type="primary" @click="ok">确 定</el-button>
        </div>
    </el-dialog>
</template>

<script>
import API from '@/api'
import XCard from '@/components/Card'
import _ from 'lodash'
import { isType } from '@/lib/util'

export default {
    components: {
        XCard
    },
    props: {
        title: {
            type: String,
            default: '选择图文'
        },
        api: {
            type: [String, Array],
            default: 'article.list'
        },
        pageSize: {
            type: Number,
            default: 20
        },
        visible: {
            type: Boolean,
            required: true
        },
        gutter: {
            type: Number,
            default: 14
        },
        col: {
            type: Number,
            default: 4
        },
        max: {
            type: Number,
            default: 1
        },
        selectedArticles: {
            type: [Array, Object],
            default() {
                return []
            }
        }
    },
    data() {
        return {
            articles: [],
            innerSelectedArticles: [],
            total: 0,
            page: 1,
            filters: { title: '' }
        }
    },
    computed: {
        innerAPI() {
            if (typeof this.api === 'string') {
                return [this.api, {}]
            }

            return this.api
        }
    },
    methods: {
        fetchData() {
            return API.loading()
                .invoke(
                    this.innerAPI[0],
                    Object.assign(
                        {
                            page: this.page,
                            pageSize: this.pageSize
                        },
                        this.innerAPI[1],
                        this.filters
                    )
                )
                .then(data => {
                    this.articles = data.data
                    this.total = data.total
                })
        },
        open() {
            this.fetchData().then(() => {
                let selArticles = this.selectedArticles || []
                if (!isType(selArticles, Array)) {
                    selArticles = [selArticles]
                }
                this.innerSelectedArticles = _.cloneDeep(selArticles)
            })
        },
        pageChange() {
            this.fetchData()
        },
        search() {
            this.innerSelectedArticles = []
            this.fetchData()
        },
        cancel() {
            this.$emit('update:visible', false)
        },
        ok() {
            let selected = this.innerSelectedArticles
            if (this.max === 1) {
                selected = selected.length ? selected[0] : null
            }

            this.$emit('update:visible', false)
            this.$emit('update:selectedArticles', selected)
            this.$emit('ok', selected)
        },
        clickCard(article) {
            const index = this.indexOf(this.innerSelectedArticles, article)
            if (index !== -1) {
                this.innerSelectedArticles.splice(index, 1)
            } else {
                if (this.max === 1) {
                    // 单选
                    this.innerSelectedArticles = [_.cloneDeep(article)]
                } else if (this.innerSelectedArticles.length < this.max) {
                    this.innerSelectedArticles.push(_.cloneDeep(article))
                }
            }
        },
        indexOf(arr, item) {
            for (let i = 0; i < arr.length; i++) {
                if (arr[i].id === item.id) {
                    return i
                }
            }

            return -1
        }
    }
}
</script>

<style lang="scss" scoped>
@import 'src/styles/variable.scss';
@import 'src/styles/mixin.scss';

.body {
    width: 100%;
    .content {
        width: 100%;
        height: 550px;
        overflow: scroll;
        .article-card {
            cursor: pointer;
        }
    }
    .footer {
        padding-top: $padding-two;
        text-align: right;
    }
}
</style>
