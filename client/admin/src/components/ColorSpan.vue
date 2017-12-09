<template>
    <p class="colorful">
        <template v-for="(word, key) in words">
            <span :key="key" :style="{color: pickColor(word)}">{{ word }}</span>
            <i :key="key + '_i'">{{ seperator }}</i>
        </template>
    </p>
</template>

<script>
export default {
    props: {
        value: {
            type: [String, Array],
            required: true
        },
        color: {
            type: [String, Object],
            required: true
        },
        seperator: {
            type: String,
            default: '，'
        }
    },
    computed: {
        words() {
            return typeof this.value === 'string' ? [this.value] : this.value
        }
    },
    methods: {
        pickColor(word) {
            const colors = typeof this.color === 'string' ? { _: this.color } : this.color

            if (colors[word]) {
                return colors[word]
            } else if (colors._) {
                return colors._
            } else {
                return ''
            }
        }
    }
}
</script>

<style lang="scss" scoped>
.colorful{
    display:inline;
    i:last-child{
        display:none;
    }
}
</style>
