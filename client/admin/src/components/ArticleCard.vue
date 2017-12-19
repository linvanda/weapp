<template>
    <div class="article">
        <section class="main" :style="{ height: mainHeight }">
            <img :src="main.image">
            <p class="title">{{ main.title }}</p>
        </section>
        <ul v-if="sub && sub.length" class="sub">
            <li class="item" v-for="(subItem, index) in sub" :key="index">
                <p class="sub-title">{{ subItem.title }}</p>
                <div class="img" :style="{ height: subHeight, width: subHeight }">
                    <img :src="subItem.image">
                </div>
            </li>
        </ul>
        <slot name="bottom-ops"></slot>
    </div>
</template>

<script>
export default {
    props: {
        main: {
            type: Object,
            required: true,
            validator(val) {
                if (!val.image || !val.title) {
                    return false
                }

                return true
            }
        },
        sub: {
            type: Array,
            default() {
                return []
            },
            validator(vals) {
                for (const item of vals) {
                    if (!item.image || !item.title) {
                        return false
                    }
                }

                return true
            }
        },
        mainHeight: {
            type: String,
            default: '180px'
        },
        subHeight: {
            type: String,
            default: '80px'
        }
    }
}
</script>

<style lang="scss" scoped>
@import 'src/styles/variable.scss';
@import 'src/styles/mixin.scss';

.article {
    .main {
        overflow: hidden;
        position: relative;
        .title {
            position: absolute;
            bottom: 0;
            background-color: rgba(#000000, 0.5);
            color: white;
            width: 100%;
            padding-left: $padding-three;
            @include ellipsis;
        }
        img {
            width: 100%;
            height: auto;
        }
    }
    .sub {
        .item {
            display: flex;
            display: -webkit-flex;
            border-bottom: 1px dashed $border-three;
            padding: $padding-three;
            &:last-child {
                border-bottom: 0;
            }
            .sub-title {
                flex: 1;
                line-height: 1;
                padding-right: $padding-three;
                @include ellipsis;
            }
            .img {
                img {
                    width: 100%;
                    height: 100%;
                }
            }
        }
    }
}
</style>
