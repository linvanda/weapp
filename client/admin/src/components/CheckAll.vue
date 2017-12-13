<template>
    <div class="check-all">
        <el-checkbox :indeterminate="isIndeterminate" v-model="checkAll" @change="handleCheckAllChange">{{ title }}</el-checkbox>
        <el-checkbox-group v-model="innerChecked" class="checkbox">
            <el-checkbox v-for="(item, index) in items" :label="item[props.key]" :key="index">{{ item[props.label] }}</el-checkbox>
        </el-checkbox-group>
    </div>
</template>

<script>
import { isType } from '@/lib/util'
import _ from 'lodash'

export default {
    props: {
        title: {
            type: String,
            default: '全选'
        },
        items: {
            type: Array,
            required: true
        },
        props: {
            type: Object,
            default: () => ({ key: 'id', label: 'name' }),
            validator(val) {
                if (!val.key || !val.label) {
                    return false
                }

                return true
            }
        },
        checked: {
            type: Array,
            default: () => [],
            validator(val) {
                for (const item of val) {
                    if (!isType(item, [String, Number])) {
                        return false
                    }
                }

                return true
            }
        }
    },
    data() {
        return {
            innerChecked: []
        }
    },
    computed: {
        isIndeterminate() {
            return !(!this.innerChecked.length || this.innerChecked.length === this.items.length)
        },
        checkAll: {
            get() {
                return this.innerChecked.length === this.items.length
            },
            set() {}
        }
    },
    methods: {
        handleCheckAllChange(val) {
            this.innerChecked = val ? this.all() : []
        },
        all() {
            return this.items.map(item => item[this.props.key])
        }
    },
    watch: {
        innerChecked(val) {
            const all = this.all()
            this.$emit('update:checked', this.checked.filter(item => all.indexOf(item) === -1).concat(val))
        }
    },
    created() {
        const all = this.all()
        this.innerChecked = this.checked.filter(key => {
            return all.indexOf(key) > -1
        })
    }
}
</script>

<style lang="scss" scoped>
.check-all{
    margin-bottom: 15px;
    .el-checkbox-group{
        padding-left: 24px;
    }
}
</style>
