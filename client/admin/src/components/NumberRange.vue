<template>
    <span class="range">
        <div class="el-input">
            <input :value="min" @input="inputEvent" @blur="blur" autocomplete="off" name="innerMin" type="text" placeholder="最小值" class="el-input__inner">
        </div>
        至
        <div class="el-input">
            <input :value="max" @input="inputEvent" @blur="blur" autocomplete="off" name="innerMax" type="text" placeholder="最大值" class="el-input__inner">
        </div>
    </span>
</template>

<script>
import Vue from 'vue'

export default {
    props: {
        value: {
            type: Array,
            required: true
        }
    },
    data() {
        return {
            innerMin: typeof this.value[0] === 'undefined' ? '' : this.value[0],
            innerMax: typeof this.value[1] === 'undefined' ? '' : this.value[1]
        }
    },
    computed: {
        min() {
            return typeof this.value[0] === 'undefined' ? '' : this.value[0]
        },
        max() {
            return typeof this.value[1] === 'undefined' ? '' : this.value[1]
        }
    },
    methods: {
        change() {
            // 和 dom 使用同一个过滤器，保证数据的一致性
            let data = [
                this.innerMin,
                this.innerMax
            ]

            this.$emit('input', data)
            this.$emit('change', data)
        },
        inputEvent(event) {
            const target = event.target
            this[target.name] = target.value
            this.change()
        },
        blur(event) {
            const val = event.target.value

            /* eslint-disable eqeqeq */
            if (val != this.parseFloat(val)) {
                // 纠正父组件的数据
                this[event.target.name] = this.parseFloat(val)
                this.change()
            }
        },
        parseFloat(val) {
            return Vue.filter('number')(val)
        }
    }
}
</script>

<style lang="scss" scoped>
.range {
    .el-input {
        width: 100px;
    }
}
</style>
