<template>
    <div class="card" :style="{ marginBottom: marginBottom }">
        <div class="img" :style="{ height: imageHeight }"><img :src="image"></div>
        <div class="text">
            <p class="title">{{ title }}</p>
            <div class="bottom">
                <time class="time">{{ tip }}</time>
            </div>
        </div>
        <choose-mask :show="mask"></choose-mask>
    </div>
</template>

<script>
import ChooseMask from '@/components/ChooseMask'

export default {
    components: {
        ChooseMask
    },
    props: {
        image: {
            type: String,
            required: true
        },
        title: {
            type: String,
            required: true
        },
        tip: {
            type: String,
            default: ''
        },
        imageHeight: {
            type: String,
            default: '160px'
        },
        marginBottom: {
            type: String,
            default: '20px'
        },
        mask: {
            type: Boolean,
            default: false
        }
    }
}
</script>

<style lang="scss" scoped>
@import 'src/styles/variable.scss';
@import 'src/styles/mixin.scss';

.card {
    position: relative;
    border: 1px solid $border-four;
    border-radius: 4px;
    overflow: hidden;
    .img {
        width: 100%;
        overflow: hidden;
        img {
            display: block;
            width: 100%;
            height: auto;
        }
    }
    .text {
        padding: $padding-five $padding-four;
        .title {
            color: $font-main;
            font-size: $font-size-small;
        }
        .time {
            color: $font-aide;
            font-size: $font-size-xsmall;
        }
    }
}
</style>
