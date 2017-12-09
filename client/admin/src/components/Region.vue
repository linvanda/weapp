<template>
    <el-cascader :options="options" :value="value" :change-on-select="pickAnyLevel" :clearable="clearable" filterable @change="change" :expand-trigger="trigger"></el-cascader>
</template>

<script>
import { provinceAndCityData, regionData } from 'element-china-area-data'

export default {
    props: {
        // 选中的值，双向通信
        value: {
            type: Array,
            required: true
        },
        // 级数
        level: {
            type: Number,
            default: 3,
            validator(val) {
                return [1, 2, 3].indexOf(val) !== -1
            }
        },
        // 是否可以选择任意级到数据
        pickAnyLevel: {
            type: Boolean,
            default: false
        },
        // 是否可清空
        clearable: {
            type: Boolean,
            default: true
        }
    },
    data() {
        return {
            trigger: this.pickAnyLevel ? 'click' : 'hover'
        }
    },
    computed: {
        options() {
            let regions = this.level === 3 ? regionData : provinceAndCityData
            if (this.level === 1) {
                regions = regions.map(item => {
                    delete item.children
                    return item
                })
            }

            return regions
        }
    },
    methods: {
        change(selected) {
            this.$emit('input', selected)
            this.$emit('change', selected)
        }
    }
}
</script>
