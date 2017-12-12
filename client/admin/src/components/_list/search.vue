<template>
    <section class="search">
        <el-form ref="search" inline label-position="left">
            <el-form-item v-for="item in innerItems" :key="item.key" :label="item.label">
                <el-select v-if="item.type === 'select' || item.type === 'multiselect'" v-model="item.value" clearable filterable :placeholder="item.placeholder" :multiple="item.type === 'multiselect'">
                    <el-option v-for="option in item.data" :key="option.key" :label="option.label" :value="option.label"></el-option>
                </el-select>
                <number-range v-else-if="item.type === 'range'" v-model="item.value"></number-range>
                <el-date-picker v-else-if="item.type === 'daterange'" v-model="item.value" format="yyyy-MM-dd" value-format="yyyy-MM-dd" type="daterange" :picker-options="dateRangeOptions" range-separator="至" unlink-panels start-placeholder="开始日期" end-placeholder="结束日期"></el-date-picker>
                <x-region v-else-if="item.type === 'region'" v-model="item.value" :level="item.level" :pick-any-level="item.pickAnyLevel"></x-region>
                <input v-else-if="item.type === 'hidden'" type="hidden" :value="item.value">
                <el-input v-else v-model="item.value" :placeholder="item.placeholder"></el-input>
            </el-form-item>
            <el-form-item class="search-btn">
                <el-button @click="reset">清空</el-button>
                <el-button @click="search" type="primary" icon="el-icon-search">搜索</el-button>
            </el-form-item>
        </el-form>
    </section>
</template>

<script>
import _ from 'lodash'
import { isType, type, empty } from '@/lib/util'
import XRegion from '@/components/Region'
import NumberRange from '@/components/NumberRange'

const validTypes = [
    'input',
    'select',
    'multiselect',
    'range',
    'daterange',
    'region',
    'hidden'
]

export default {
    components: {
        XRegion,
        NumberRange
    },
    props: {
        // 搜索项
        items: {
            type: Array,
            required: true,
            validator(items) {
                for (const item of items) {
                    if (
                        !(isType(item, Object) && item['key'] && (item['label'] || item['type'] === 'hidden'))
                    ) {
                        return false
                    }

                    // 隐藏于必须指定 label
                    if (
                        item['type'] === 'hidden' &&
                        typeof item['value'] === 'undefined'
                    ) {
                        return false
                    }
                }

                return true
            }
        }
    },
    data() {
        return {
            dateRangeOptions: {
                shortcuts: [
                    {
                        text: '最近一周',
                        onClick(picker) {
                            const end = new Date()
                            const start = new Date()
                            start.setTime(
                                start.getTime() - 3600 * 1000 * 24 * 7
                            )
                            picker.$emit('pick', [start, end])
                        }
                    },
                    {
                        text: '最近一个月',
                        onClick(picker) {
                            const end = new Date()
                            const start = new Date()
                            start.setTime(
                                start.getTime() - 3600 * 1000 * 24 * 30
                            )
                            picker.$emit('pick', [start, end])
                        }
                    },
                    {
                        text: '最近三个月',
                        onClick(picker) {
                            const end = new Date()
                            const start = new Date()
                            start.setTime(
                                start.getTime() - 3600 * 1000 * 24 * 90
                            )
                            picker.$emit('pick', [start, end])
                        }
                    }
                ]
            },
            innerItems: null
        }
    },
    methods: {
        search() {
            // 只有当点 搜索 时，才将数据更新到父组件，并触发父组件的 search 事件
            // 父组件需要使用 items.sync
            this.$emit('update:items', this.innerItems)
            this.$emit('search')
        },
        reset() {
            this.innerItems.forEach(item => {
                if (item.type !== 'hidden') {
                    let value = item.value
                    const t = type(value)

                    if (t === Object) {
                        value = {}
                    } else if (t === Array) {
                        value = []
                    } else {
                        value = ''
                    }

                    item.value = value
                }
            })

            this.$emit('update:items', this.innerItems)
        },
        normalizeItems() {
            return _.cloneDeep(this.items).map(item => {
                if (!(item.type && validTypes.indexOf(item.type))) {
                    item.type = 'input'
                }

                if (empty(item.value, true)) {
                    switch (item.type) {
                        case 'multiselect':
                        case 'range':
                        case 'daterange':
                        case 'region':
                            item.value = []
                            break
                        default:
                            item.value = ''
                            break
                    }
                }

                if (item.type === 'region') {
                    item.level || (item.level = 3)
                    ;(item.pickAnyLevel && item.pickAnyLevel === true) ||
                        (item.pickAnyLevel = false)
                } else if (item.type === 'hidden' && item.label) {
                    item.label = ''
                }

                return item
            })
        }
    },
    created() {
        this.innerItems = this.normalizeItems()
    }
}
</script>

<style lang="scss" scoped>
.search {
    padding-bottom: 30px;
    .range {
        .el-input-number {
            width: 120px;
        }
    }
    .el-form-item {
        margin-right: 40px;
    }
}
</style>
