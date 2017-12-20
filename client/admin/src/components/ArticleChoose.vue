<template>
    <el-dialog width="70%" :title="title" :visible="visible" @open="open" @close="cancel" :close-on-click-modal="false" :close-on-press-escape="false">
        <div v-loading="$store.state.loading" class="body">
            <div class="header"></div>
            <el-row :gutter="gutter" class="content">
                <el-col :span="24/col" v-for="article in articles" :key="article.id">
                    <x-card :image="article.image" :title="article.title" :tip="article.date" :mask="mask" @click.native="clickCard(article)"></x-card>
                </el-col>
                <el-col :span="24" v-if="!articles.length">暂无数据</el-col>
            </el-row>
            <div class="footer"></div>
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
        maxChoose: {
            type: Number,
            default: 1
        }
    },
    data() {
        return {
            articles: [],
            checkedArticles: [],
            total: 0,
            page: 1,
            filters: {},
            mask: false
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
            API.loading()
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
            this.fetchData()
        },
        cancel() {
            this.$emit('update:visible', false)
        },
        ok() {
            this.$emit('update:visible', false)
        },
        clickCard(article) {

        }
    },
    created() {
        this.fetchData()
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
    }
}
</style>
