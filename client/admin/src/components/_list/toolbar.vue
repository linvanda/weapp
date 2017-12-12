<template>
    <section class="toolbar">
        <el-button v-for="item in toolItems" :key="item.key" @click="click(item)" :type="item.buttonType || 'default'" :loading="item.loading ? !!$store.state.doing : false" v-permit="item.permission">
            <i v-if="item.icon" :class="item.icon"></i> 
            {{ item.label }}
        </el-button>
    </section>
</template>

<script>
import { isType } from '@/lib/util'

export default {
    props: {
        items: {
            type: Array,
            required: true,
            validator(items) {
                for (const item of items) {
                    if (!isType(item, Object) || !item['type']) {
                        return false
                    }

                    if (item['type'] !== 'export' && (!item['label'] || !item['key'])) {
                        return false
                    }
                }

                return true
            }
        }
    },
    computed: {
        toolItems() {
            return this.items.map(item => {
                if (item['type'] === 'export') {
                    !item['label'] && (item['label'] = '导出 Excel')
                    !item['icon'] && (item['icon'] = 'el-icon-download')
                    !item['buttonType'] && (item['buttonType'] = 'primary')
                    !item['key'] && (item['key'] = 'export')
                    item['loading'] = true
                }

                return item
            })
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
.toolbar {
    text-align: right;
    padding-bottom: 20px;
}
</style>
