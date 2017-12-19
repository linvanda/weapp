<template>
    <ul class="plus-ops" :style="{ height, padding }">
        <li v-for="item in items" :key="item.key" class="op-item">
            <div class="op-content" @click="click(item)">
                <i class="el-icon-plus"></i>
                <p>{{ item.label }}</p>
            </div>
        </li>
    </ul>
</template>

<script>
export default {
    props: {
        items: {
            type: Array,
            required: true,
            validator(vals) {
                for (const val of vals) {
                    if (!val.key || !val.label) {
                        return false
                    }
                }

                return true
            }
        },
        height: {
            type: String,
            default: '180px'
        },
        padding: {
            type: [String, Number],
            default: 0
        }
    },
    methods: {
        click(item) {
            this.$emit('click', item)
        }
    }
}
</script>

<style lang="scss" scoped>
@import 'src/styles/variable.scss';

.plus-ops {
    display: flex;
    display: -webkit-flex;
    .op-item {
        box-sizing: border-box;
        border: 2px dashed $border-three;
        height: 100%;
        width: 50%;
        margin-left: $padding-three;
        text-align: center;
        position: relative;
        &:first-child {
            margin-left: 0;
        }
        &:hover {
            border-color: $border-black;
        }
        .op-content {
            position: absolute;
            top: 0;
            bottom: 0;
            left: 0;
            right: 0;
            margin: auto;
            height: 60px;
            width: 100%;
            cursor: pointer;
            text-align: center;
            overflow: hidden;
            i, p {
                display: block;
                width: 100%;
                line-height: 1.1;
            }
            i {
                font-size: 40px;
                color: $font-placeholder;
            }
            p {
                color: $font-aide;
            }
        }
    }
}
</style>
