<template>
    <ul class="plus-ops" :style="{ height, padding }">
        <li v-for="item in items" :key="item.key" class="op-item">
            <!-- 文件/图片上传，此处不负责上传后图片的展示，且每次上传完成后都会清空 file-list -->
            <el-upload 
                v-if="item.type && item.type === 'upload'"
                :ref="item.key"
                :action="uploadUrl" 
                :show-file-list="false" 
                :accept="item.accept || ''" 
                :multiple="item.limit && item.limit > 1 ? true : true"
                :limit="item.limit || 3"
                :before-upload="beforeUpload"
                :on-exceed="imageExceed(item.limit || 1)"
                :on-success="successUpload(item)"
                :on-error="errorUpload"
                >
                <div class="op-content" @click="click(item)" v-loading="uploadLoading">
                    <i class="el-icon-plus"></i>
                    <p>{{ item.label }}</p>
                </div>
            </el-upload>
            <!-- 普通操作 -->
            <div v-else class="op-content" @click="click(item)">
                <i class="el-icon-plus"></i>
                <p>{{ item.label }}</p>
            </div>
        </li>
    </ul>
</template>

<script>
export default {
    props: {
        items: {
            type: Array,
            required: true,
            validator(vals) {
                for (const val of vals) {
                    if (!val.key || !val.label) {
                        return false
                    }
                }

                return true
            }
        },
        height: {
            type: String,
            default: '180px'
        },
        padding: {
            type: [String, Number],
            default: 0
        }
    },
    data() {
        return {
            uploadLoading: false,
            uploadUrl: global.$conf.env.UPLOAD_URL
        }
    },
    methods: {
        click(item) {
            this.$emit('click', item)
        },
        beforeUpload() {
            this.uploadLoading = true
        },
        successUpload(item) {
            return (response) => {
                item.success && item.success(response)
                this.clearUpload(item.key)
            }
        },
        errorUpload(item) {
            return (error) => {
                console.log('upload error:', error)
                this.$message.error('文件上传失败，请重试')
                item.error && item.error(error)
                this.clearUpload(item.key)
            }
        },
        imageExceed(limit) {
            return () => {
                this.$message.error(`文件数量超限，最多只能上传 ${limit} 个文件`)
            }
        },
        clearUpload(name) {
            this.uploadLoading = false
            this.$refs[name][0].clearFiles()
        }
    }
}
</script>

<style lang="scss" scoped>
@import 'src/styles/variable.scss';

.plus-ops {
    display: flex;
    display: -webkit-flex;
    .op-item {
        box-sizing: border-box;
        border: 2px dashed $border-three;
        height: 100%;
        width: 50%;
        margin-left: $padding-three;
        text-align: center;
        position: relative;
        &:first-child {
            margin-left: 0;
        }
        &:hover {
            border-color: $border-black;
        }
        .op-content {
            position: absolute;
            top: 0;
            bottom: 0;
            left: 0;
            right: 0;
            margin: auto;
            height: 60px;
            width: 100%;
            cursor: pointer;
            text-align: center;
            overflow: hidden;
            i, p {
                display: block;
                width: 100%;
                line-height: 1.1;
            }
            i {
                font-size: 40px;
                color: $font-placeholder;
            }
            p {
                color: $font-aide;
            }
        }
    }
}
</style>
