<template>
    <div>
        <el-row v-loading="!!$store.state.loading">
            <el-col :span="6" class="left">
                <article-card 
                    :article.sync="article" 
                    :sortable="sortable" 
                    class="article-list"
                    :activeIndex="activeIndex"
                    @click="clickArticleItem"></article-card>
                    <div class="bottom-ops">
                        <el-button @click="sortable = !sortable" plain icon="el-icon-sort">{{ sortable ? '完成排序' : '图文排序' }}</el-button>
                        <el-button type="primary" plain @click="addArticle" icon="el-icon-plus">添加子图文</el-button>
                    </div>
            </el-col>
            <el-col :span="formWidth" class="right">
                <el-form class="content short-form" v-model="activeItem" label-position="top">
                    <el-form-item label="标题">
                        <el-input v-model="activeItem.title"></el-input>
                    </el-form-item>
                    <el-form-item>
                        <p slot="label">作者<span class="title-tip">（选填）</span></p>
                        <el-input v-model="activeItem.author"></el-input>
                    </el-form-item>
                    <el-form-item label="封面">
                        <div class="cover-image">
                            <img :src="activeItem.image">
                        </div>
                        <div>
                            <el-checkbox label="封面图片显示在正文中" v-model="activeItem.displayImage"></el-checkbox>
                        </div>
                        <div class="cover-op">
                            <crop-image :ratio="5/3" @success="cropSuccess">
                                <el-button type="primary" icon="el-icon-upload">本地上传</el-button>
                            </crop-image>
                            <el-button style="margin-left: 10px;" @click="chooseImageVisible = true">从素材库中选择</el-button>
                        </div>
                    </el-form-item>
                    <el-form-item>
                        <p slot="label">摘要<span class="title-tip">（选填，该摘要只在图文消息为单条图文时才显示）</span></p>
                        <el-input type="textarea" :rows="5" v-model="activeItem.summary"></el-input>
                    </el-form-item>
                    <el-form-item label="正文">

                    </el-form-item>
                </el-form>
                <image-choose :visible.sync="chooseImageVisible" return-type="string" :selected-images.sync="activeItem.image"></image-choose>
            </el-col>
        </el-row>
        <div class="op">
            <el-button class="large">返 回</el-button>
            <el-button class="large" type="primary">保 存</el-button>
        </div>
    </div>
</template>

<script>
import API from '@/api'
import ArticleCard from '@/components/ArticleCard'
import ImageChoose from '@/components/ImageChoose'
import CropImage from '@/components/CropImage'
import _ from 'lodash'

export default {
    components: {
        ArticleCard,
        ImageChoose,
        CropImage
    },
    props: {
        id: {
            type: String
        }
    },
    data() {
        return {
            article: [],
            sortable: false,
            max: 5,
            activeIndex: 0,
            articleTemplate: {
                title: '',
                image: '',
                author: '',
                summary: '',
                content: '',
                displayImage: false

            },
            formWidth: 18,
            chooseImageVisible: false
        }
    },
    computed: {
        activeItem() {
            return this.activeIndex !== -1 && this.article[this.activeIndex] ? this.article[this.activeIndex] : {}
        }
    },
    methods: {
        getArticleInfo(id) {
            API.loading().invoke('article.info', id)
            .then(article => {
                this.article = article
            })
        },
        addArticle() {
            if (this.article.length >= this.max) {
                this.$alert(`最多只能添加 ${this.max} 条图文`, {
                    closeOnClickModal: true,
                    closeOnPressEscape: true
                })
            } else {
                this.article.push(_.cloneDeep(this.articleTemplate))
                this.activeIndex = this.article.length - 1
            }
        },
        clickArticleItem(index) {
            this.activeIndex = index
        },
        cropSuccess(result) {
            this.activeItem.image = result.data[0].src
        }
    },
    created() {
        if (this.id) {
            this.getArticleInfo(this.id)
        }
    }
}
</script>

<style lang="scss" scoped>
@import 'src/styles/variable.scss';
@import 'src/styles/mixin.scss';

.left {
    .bottom-ops {
        text-align: center;
        margin-top: $padding-one;
    }
    .article-list {
        position: relative;
        border: 1px solid $border-three;
    }
    .article-card {
        cursor: pointer;
    }
}
.right {
    padding: 0 $padding-two;
    .content {
        border: 1px solid $border-two;
        min-height: 500px;
        padding: $padding-two;
        .cover-image {
            width: 319px;
            max-height: 176px;
            overflow: hidden;
            border: 1px solid $border-four;
            img {
                max-width: 100%;
                max-height: 100%;
            }
        }
        .cover-op {
            display: flex;
            padding: $padding-three 0;
        }
        .title-tip {
            color: $font-placeholder;
        }
    }
}
.op {
    text-align: center;
    padding: $padding-large 0;
}
</style>
