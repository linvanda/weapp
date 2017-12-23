<template>
    <div class="article-card" :class="{ pointer: sortable }">
        <draggable v-model="innerArticle" :options="dragOptions">
            <transition-group name="article" tag="ul">
                <template v-for="(art, index) in article">
                    <li 
                        v-if="index === 0" 
                        :class="{ main: true, active: activeIndex === index }" 
                        :style="{ height: mainHeight }" :key="index"
                        @click.stop="clickItem(index)">
                            <img :src="art.image">
                            <p class="title">{{ art.title }}</p>
                            <i v-show="sortable" class="el-icon-sort mask"></i>
                    </li>
                    <li 
                        v-else-if="showSub" 
                        :class="{ sub: true, active: activeIndex === index }" 
                        :key="index"
                        @click.stop="clickItem(index)">
                            <p class="sub-title">{{ art.title }}</p>
                            <div class="img" :style="{ height: subHeight, width: subHeight }">
                                <img :src="art.image">
                            </div>
                            <i v-show="sortable" class="el-icon-sort mask"></i>
                    </li>
                </template>
            </transition-group>
        </draggable>
        <slot name="bottom-ops"></slot>
    </div>
</template>

<script>
import Draggable from 'vuedraggable'

export default {
    components: {
        Draggable
    },
    props: {
        article: {
            type: Array,
            required: true,
            validator(val) {
                for (const v of val) {
                    if (typeof v.image === 'undefined' || typeof v.title === 'undefined') {
                        return false
                    }
                }

                return true
            }
        },
        // 是否显示子图文
        showSub: {
            type: Boolean,
            default: true
        },
        // 主图文高度
        mainHeight: {
            type: String,
            default: '180px'
        },
        // 子图文高度
        subHeight: {
            type: String,
            default: '80px'
        },
        // 是否可排序
        sortable: {
            type: Boolean,
            default: false
        },
        // 激活态显示
        activeIndex: {
            type: Number,
            default: -1
        }
    },
    computed: {
        innerArticle: {
            get() {
                return this.article
            },
            set(val) {
                this.$emit('update:article', val)
            }
        },
        dragOptions() {
            return {
                disabled: !this.sortable
            }
        },
        mask() {
            return this.sortable
        }
    },
    methods: {
        clickItem(index) {
            this.$emit('click', index)
        }
    }
}
</script>

<style lang="scss">
@import 'src/styles/variable.scss';
@import 'src/styles/mixin.scss';

.article-card {
    &.pointer {
        cursor: pointer;
    }
    .main, .sub {
        position: relative;
        .mask {
            display: block;
            position: absolute;
            background-color: rgba(0, 0, 0, .6);
            left: 0;
            right: 0;
            bottom: 0;
            color: white;
            font-size: 1.5em;
            font-weight: 900;
            line-height: 1;
            padding: $padding-four $padding-three;
            margin-bottom: $padding-three;
        }
    }
    .main {
        overflow: hidden;
        .title {
            position: absolute;
            bottom: 0;
            background-color: rgba(#000000, 0.5);
            color: white;
            width: 100%;
            line-height: 1;
            padding: $padding-four $padding-three;
            @include ellipsis;
        }
        img {
            width: 100%;
            height: auto;
        }
        .mask {
            margin-bottom: 0;
        }
    }
    .sub {
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
    .active {
        border: 2px solid $color-success!important;
    }
}
.sort-btn {
    text-align: center;
    padding: $padding-two;
    .el-button {
        width: $btn-big;
    }
}
</style>
