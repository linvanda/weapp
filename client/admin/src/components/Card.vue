<template>
    <div class="card" :style="{ marginBottom: marginBottom }" :class="{ border: hasBorder, radius: hasRadius }">
        <div class="img" :style="{ height: imageHeight }"><img :src="image"></div>
        <div v-if="showText" class="text">
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
            type: String
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
        },
        hasBorder: {
            type: Boolean,
            default: true
        },
        hasRadius: {
            type: Boolean,
            default: true
        }
    },
    computed: {
        showText() {
            return this.title || this.tip
        }
    }
}
</script>

<style lang="scss" scoped>
@import 'src/styles/variable.scss';
@import 'src/styles/mixin.scss';

.card {
    position: relative;
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
            @include ellipsis;
        }
        .time {
            color: $font-aide;
            font-size: $font-size-xsmall;
        }
    }
}
.border {
    border: 1px solid $border-four;
}
.radius {
    border-radius: 4px;
}
</style>
