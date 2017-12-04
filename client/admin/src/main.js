import Vue from 'vue'
import ElementUI from 'element-ui'
import 'normalize.css'
import 'config/app'
import App from '@/App'
import router from '@/router'
import store from '@/store'
import '@/permission'

import '@/lib/menu'

Vue.use(ElementUI)
Vue.config.productionTip = false

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
        
        // 引入主题文件
        const link = document.getElementById('theme-css-link')
        link.href = this.$store.state.app.theme.path
        link.onload = () => {
            this.$mount('#app')
        }
    }
})
