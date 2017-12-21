<template>
    <el-dialog width="60%" :title="title" :visible="visible" @open="open" @close="cancel" :close-on-click-modal="false" :close-on-press-escape="true">
        <div v-loading="$store.state.loading" class="body">
            <div class="header">
                <el-button icon="el-icon-upload">上传图片</el-button>
            </div>
            <el-row :gutter="gutter" class="content">
                <el-col :span="24/col" v-for="image in images" :key="image.id">
                    <x-card 
                        class="article-card" 
                        :image="image.src" 
                        :mask="innerSelectedImages.some(item => item.id === image.id)" 
                        :hasBorder="false"
                        :hasRadius="false"
                        @click.native="clickCard(image)">
                    </x-card>
                </el-col>
                <el-col :span="24" v-if="!images.length" class="empty">暂无数据</el-col>
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
            default: '选择图片'
        },
        api: {
            type: [String, Array],
            default: 'media.imageList'
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
        selectedImages: {
            type: [Array, Object],
            default() {
                return []
            }
        }
    },
    data() {
        return {
            images: [],
            innerSelectedImages: [],
            total: 0,
            page: 1
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
                        this.innerAPI[1]
                    )
                )
                .then(data => {
                    this.images = data.data
                    this.total = data.total
                })
        },
        open() {
            this.fetchData().then(() => {
                let selImages = this.selectedImages || []
                if (!isType(selImages, Array)) {
                    selImages = [selImages]
                }
                this.innerSelectedImages = _.cloneDeep(selImages)
            })
        },
        pageChange() {
            this.fetchData()
        },
        search() {
            this.innerSelectedImages = []
            this.fetchData()
        },
        cancel() {
            this.$emit('update:visible', false)
        },
        ok() {
            let selected = this.innerSelectedImages
            if (this.max === 1) {
                selected = selected.length ? selected[0] : null
            }

            this.$emit('update:visible', false)
            this.$emit('update:selectedImages', selected)
            this.$emit('ok', selected)
        },
        clickCard(image) {
            const index = this.indexOf(this.innerSelectedImages, image)
            if (index !== -1) {
                this.innerSelectedImages.splice(index, 1)
            } else {
                if (this.max === 1) {
                    // 单选
                    this.innerSelectedImages = [_.cloneDeep(image)]
                } else if (this.innerSelectedImages.length < this.max) {
                    this.innerSelectedImages.push(_.cloneDeep(image))
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
    .header {
        padding-bottom: $padding-two;
        padding-right: $padding-three;
        text-align: right;
    }
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
