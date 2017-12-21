<template>
    <div>
        <el-upload ref="upload" accept="image/jpg, image/jpeg, image/png, image/gif" :action="uploadUrl" :multiple="false" :show-file-list="false" :drag="dragable" :auto-upload="false" :limit="1" :on-success="imageUploaded" :on-error="imageError" :on-change="imageChange">
            <slot>
                <el-button type="primary" icon="el-icon-upload">选择图片</el-button>
            </slot>
        </el-upload>

        <div class="cropper">
            <img id="cropperimage" :src="origImage">
            <div id="preview"></div>
        </div>
    </div>
</template>

<script>
import Cropper from 'cropperjs'

// 图片裁切上传
export default {
    props: {
        // 文件最大尺寸
        maxFileSize: {
            type: Number,
            default: 5242880
        },
        // 裁切比例
        ratio: {
            type: String,
            default: '1:1'
        },
        // 图片压缩比例
        compress: {
            type: Number,
            default: 40
        },
        // 是否支持拖拽上传
        dragable: {
            type: Boolean,
            default: false
        }
    },
    data() {
        return {
            origImage: '/static/img/meinv.jpg',
            cropImage: '',
            showCropper: false,
            loading: false,
            uploadUrl: global.$conf.env.UPLOAD_URL,
            cropBtn: { ok: '裁切并上传', cancel: '取消' }
        }
    },
    methods: {
        // 上传到服务器成功
        imageUploaded(result) {
            console.log(result, '=')
        },
        // 上传到服务器失败
        imageError(error) {
            this.loading = false
            console.log('image upload error:', error)
            this.$message.error('图片上传失败，请重试')
            this.$emit('error', error)
        },
        imageChange(file) {
            this.origImage = file.url
            this.newCropper()

            this.$refs.upload.clearFiles()
        },
        cropImageEvent() {
            this.cropImage = this.$refs.cropper.getCroppedCanvas().toDataURL()
        },
        newCropper() {
            const cropper = new Cropper(document.getElementById('cropperimage'), {
                aspectRatio: 16 / 9,
                viewMode: 2,
                preview: '#preview',
                minCropBoxWidth: 50,
                minCropBoxHeight: 50,
                ready() {
                    console.log('ready')
                },
                crop: function(e) {
                    console.log(e.detail.x)
                    console.log(e.detail.y)
                    console.log(e.detail.width)
                    console.log(e.detail.height)
                    console.log(e.detail.rotate)
                    console.log(e.detail.scaleX)
                    console.log(e.detail.scaleY)
                },
                cropend() {

                }
            })
            cropper.crop()
        }
    },
    created() {
        setTimeout(() => {
            this.newCropper()
        }, 1000)
    }
}
</script>

<style lang="scss" scoped>
.cropper {
    img {
        width: 100%;
    }
}
</style>
