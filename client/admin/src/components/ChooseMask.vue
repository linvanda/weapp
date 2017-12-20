<template>
    <div class="mask" v-show="show"><i class="icon el-icon-check"></i></div>
</template>

<script>
export default {
    props: {
        show: {
            type: Boolean,
            default: false
        }
    }
}
</script>


<style lang="scss" scoped>
.mask {
    position: absolute;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    background-color: rgba(0,0,0, .6);
    color: white;
    font-size: 70px;
    line-height: 1;
    .icon {
        display: inline-block;
        position: absolute;
        left: 0;
        top: 0;
        bottom: 0;
        right: 0;
        margin: auto;
        width: 70px;
        height: 70px;
        text-align: center;
        vertical-align: middle;
    }
}
</style>
