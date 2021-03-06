<template>
    <el-button 
        :type="config.btnType || 'default'" 
        size="mini" 
        @click="doAction(config.action, row, config)" 
        v-permit="config.permission"
        v-if="config.show(row)">
        {{ config.label }}
    </el-button>
</template>

<script>
import API from '@/api'
import { replacePlaceholder } from '@/lib/util'

export default {
    props: {
        config: {
            type: Object,
            required: true,
            validator(val) {
                if (val.type) {
                    if (val.type === 'link' && (!val.label || !val.to)) {
                        return false
                    }
    
                    if (val.type === 'delete' && (!val.api || !val.msg && !val.field)) {
                        return false
                    }
                } else if (!val.label || !val.action || typeof val.action !== 'function') {
                    return false
                }

                return true
            }
        },
        // 行数据
        row: {
            type: Object,
            required: true
        }
    },
    methods: {
        normalizeConfig() {
            let item = this.config
            const type = item.type

            if (type) {
                if (type === 'link') {
                    item.btnType || (item.btnType = 'primary')

                    if (!item.action) {
                        const to = typeof item.to === 'string' ? row => ({ name: item.to, params: { id: row.id } }) : item.to
                        item.action = row => {
                            return new Promise(resolve => {
                                this.$router.push(to(row))
                                resolve()
                            })
                        }
                    }
                } else if (type === 'delete') {
                    item.btnType || (item.btnType = 'danger')
                    item.label || (item.label = '删除')

                    if (!item.action) {
                        item.action = row => {
                            return new Promise(resolve => {
                                this.$confirm(replacePlaceholder(item.msg || `确定删除 :${item.field} 吗？`, row))
                                .then(() => {
                                    API.loading()
                                        .invoke(item.api, row.id)
                                        .then((result) => {
                                            this.$message.success('删除成功')

                                            resolve(result)
                                        })
                                })
                                .catch(() => {})
                            })
                        }
                    }
                }
            }

            if (!item.show) {
                item.show = () => true
            }
        },
        doAction(action, row, config) {
            action(row).then(result => {
                // 触发 done 事件
                this.$emit('done', result, config)
            })
        }
    },
    created() {
        this.normalizeConfig()
    }
}
</script>