<template>
    <div class="cropper-upload">
        <el-upload ref="upload" :accept="accept" :action="uploadUrl" :data="cropData" :multiple="false" :show-file-list="false" :drag="dragable" :auto-upload="false" :limit="1" :on-success="imageUploaded" :on-error="imageError" :on-exceed="exceed" :on-change="imageChange">
            <slot>
                <el-button type="primary" icon="el-icon-upload">本地上传</el-button>
                <div v-if="tip" slot="tip" class="el-upload__tip">{{ tip }}</div>
            </slot>
        </el-upload>
        <el-dialog title="裁切" top="6vh" :show-close="true" :visible.sync="visible" :fullscreen="false" :close-on-click-modal="false" :before-close="cancel">
            <div class="img-wrapper" v-loading="loading">
                <img :src="origImage" id="target" />
            </div>
             <span slot="footer" class="dialog-footer">
                <el-button @click="cancel">取 消</el-button>
                <el-button type="primary" :disabled="disableUpload" @click="ok">裁切并上传</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
import '@/assets/js/jquery.min.js'
import '@/assets/js/jquery.Jcrop.min.js'
import '@/assets/css/jquery.Jcrop.min.css'

let cropper
// 图片裁切上传
export default {
    props: {
        // 裁切比例，如 4 / 3
        ratio: {
            type: Number,
            default: 1
        },
        // 是否支持拖拽上传
        dragable: {
            type: Boolean,
            default: false
        },
        // 接收的图片类型
        accept: {
            type: String,
            default: 'image/jpg, image/jpeg, image/png'
        },
        // 裁切框最小尺寸
        minSize: {
            type: Array,
            default() {
                return [100, 100]
            }
        },
        tip: {
            type: String
        }
    },
    data() {
        return {
            visible: false,
            origImage: '',
            cropData: {},
            loading: false,
            disableUpload: false,
            uploadUrl: global.$conf.env.UPLOAD_URL
        }
    },
    methods: {
        // 上传到服务器成功
        imageUploaded(result) {
            this.loading = false
            this.reset()

            this.$emit('success', result)
        },
        // 上传到服务器失败
        imageError(error) {
            this.loading = false
            this.reset()
            console.log('image upload error:', error)
            this.$message.error('图片上传失败，请重试')

            this.$emit('error', error)
        },
        exceed() {
            this.$message.error('图片数量超出限制')
        },
        imageChange(file) {
            if (!file.response) {
                this.origImage = file.url
                this.visible = true
                this.$nextTick(() => {
                    this.crop() 
                })
            }
        },
        crop() {
            /* eslint-disable no-undef */
            if (!cropper) {
                $('#target').Jcrop({
                    aspectRatio: this.ratio,
                    // 裁切窗口大小
                    boxWidth: 800,
                    boxHeight: 800,
                    minSize: this.minSize,
                    setSelect: [0, 0, 800, 800],
                    onSelect: (data) => {
                        this.cropData = data
                        this.disableUpload = false
                    },
                    onRelease: () => {
                        this.cropData = {}
                        this.disableUpload = true
                    }
                }, function() {
                    cropper = this
                })
            } else {
                cropper.setImage(this.origImage)
                cropper.setSelect([0, 0, 800, 800])
            }
        },
        cancel() {
            this.reset()
        },
        ok() {
            // 上传
            this.loading = true
            this.$refs.upload.submit()
        },
        reset() {
            this.$refs.upload.clearFiles()
            this.cropData = {}
            this.visible = false
        }
    }
}
</script>

<style lang="scss">
.cropper-upload {
    div.el-dialog {
        width: 840px!important;
    }
    .img-wrapper {
        height: 60vh;
        min-height: 600px;
    }
}
</style>

