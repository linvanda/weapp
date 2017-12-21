<template>
    <image-upload
        v-loading.fullscreen.lock="loading"
        crop="local"
        :crop-ratio="ratio"
        :crop-btn="cropBtn"
        :url="uploadUrl"
        :max-file-size="maxFileSize"
        input-accept="image/jpg, image/jpeg, image/gif, image/png"
        extensions="png,jpg,jpeg,gif"
        :compress="compress"
        @imagechanged="imageChanged"
        @imageuploaded="imageUploaded"
        @errorhandle="imageError"
        >
        <slot>
            <el-button icon="el-icon-upload" type="primary">选择图片</el-button>
        </slot>
    </image-upload>
</template>

<script>
import ImageUpload from 'vue-core-image-upload'

// 图片裁切上传
export default {
    components: {
        ImageUpload
    },
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
        }
    },
    data() {
        return {
            loading: false,
            uploadUrl: global.$conf.env.UPLOAD_URL,
            cropBtn: { ok: '裁切并上传', cancel: '取消' }
        }
    },
    methods: {
        imageUploaded(result) {
            this.loading = false
            this.$emit('success', result)
        },
        imageError(error) {
            this.loading = false
            console.log('image upload error:', error)
            this.$message.error('图片上传失败，请重试')
            this.$emit('error', error)
        },
        imageChanged() {
            this.loading = true
        }
    }
}
</script>

