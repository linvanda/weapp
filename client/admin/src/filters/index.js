import { isType } from '@/lib/util'

/**
 * 过滤器。
 * 过滤器中不要抛异常
 */
export default {
    // 数组连接成字符串
    join(source, joiner = '，') {
        if (!isType(source, Array)) {
            return source
        }

        return source.join(joiner)
    },
    // 着色。 source 需要是字符串或字符串数组。color 是颜色字符串或颜色映射对象
    color(source, color) {
        if (!isType(source, [String, Array])) {
            return source
        }

        if (isType(source, String)) {
            return colorSpan(source, color)
        }

        let result = []
        source.forEach(item => {
            if (isType(color, String)) {
                result.push(colorSpan(item, color))
            } else if (isType(color, Object)) {
                if (typeof color[item] === 'string') {
                    result.push(colorSpan(item, color[item]))
                } else if (typeof color['_'] === 'string') {
                    result.push(colorSpan(item, color['_']))
                } else {
                    result.push(colorSpan(item))
                }
            } else {
                result.push(colorSpan(item))
            }
        })

        return result
    },
    // 转换成数字
    number(source) {
        const n = parseFloat(source, 10)

        if (n !== n) {
            return null
        }

        return n
    }
}

function colorSpan(word, color = '') {
    return `<span style="color:${color}">${word}</span>`
}
