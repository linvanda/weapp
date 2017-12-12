import Vue from 'vue'
import ElementUI from 'element-ui'
import { Message } from 'element-ui'
import 'normalize.css'
import 'config/app'
import App from '@/App'
import router from '@/router'
import store from '@/store'
import filters from '@/filters'
import directives from '@/directives'
import plugins from '@/plugins'
import '@/permission'

Vue.config.productionTip = false

// 插件
Vue.use(ElementUI)
Object.values(plugins).forEach(plugin => Vue.use(plugin))

// 过滤器
Object.keys(filters).forEach(name => Vue.filter(name, filters[name]))

// 指令
Object.keys(directives).forEach(name => Vue.directive(name, directives[name]))

// 给 Promise 加上成功提示的扩展
/* eslint-disable no-extend-native */
Promise.prototype.success = function(msg = '操作成功！') {
    return this.then(() => {
        Message.success(msg)
    })
}

/* eslint-disable no-new */
new Vue({
    router,
    store,
    template: '<App/>',
    components: { App },
    created() {
        /**
         * 初始化系统个性设置
         */
        this.$store.dispatch('initApp').then((getters) => {
            // 引入主题文件
            const link = document.getElementById('theme-css-link')
            link.href = getters.theme.path
            link.onload = () => {
                this.$mount('#app')
            }
        }).catch(() => {
            this.$mount('#app')
        })
    }
})
