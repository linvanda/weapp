<template>
    <div>
        <div>{{ id }}</div>
        <el-button type="primary" @click="$router.push('/user/2')">click {{ id }}</el-button>
    </div>
</template>

<script>
export default {
    props: {
        id: ''
    }
}
</script>
