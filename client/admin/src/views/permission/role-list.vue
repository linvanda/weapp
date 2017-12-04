<template>
    <div>
        <p>role list</p>
        <el-button type="primary" v-permit="permit">编辑文件</el-button>
    </div>
</template>

<script>
export default {
    data() {
        return {
            permit: 'edit-file'
        }
    }
}
</script>
