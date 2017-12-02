import Vue from 'vue'

/**
 * 环境无关的、应用程序使用的配置
 */
const config = {
    // 服务器端 api 响应码
    code: require('./code').default,
    // 持久化存储 key 前缀
    storePrefix: 'admin',
    // 退出登录后跳转向的页面路由
    logoutRedirectUrl: '/login',
    // 登录后到默认转向路由
    loginRedirectUrl: '/dashboard',
    // 默认主题
    defaultTheme: 'purple',
    // 主题定义
    theme: {
        blue: {
            name: '蓝色',
            color: '#409EFF',
            path: 'static/themes/blue/index.css'
        },
        red: {
            name: '红色',
            color: '#E22400',
            path: 'static/themes/red/index.css'
        },
        purple: {
            name: '紫色',
            color: '#5D2FEB',
            path: 'static/themes/purple/index.css'
        }
    },
    // 环境相关配置
    env: process.env
}

Vue.prototype.$conf = config
global.$conf = config
