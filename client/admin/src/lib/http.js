import axios from 'axios'
import { Message, MessageBox } from 'element-ui'
if (process.env.NODE_ENV === 'development') {
    require('@/mock')
}

const http = axios.create({
    baseURL: process.env.API_URL,
    timeout: 5000
})

// request拦截器
http.interceptors.request.use(
    config => {
        const store = require('@/store').default
        if (store.getters.token) {
            config.headers['X-Token'] = store.getters.token
        }
        return config
    },
    error => {
        return Promise.reject(error)
    }
)

// respone拦截器
http.interceptors.response.use(
    response => {
        const data = response.data
        const code = global.$conf.code

        /**
         * 应用层通用错误的处理
         */
        if (data.code !== code.OK) {
            if (data.code === code.NO_LOGIN) {
                // 未登录
                MessageBox.alert('您尚未登录或登录已过期，请重新登录', {
                    callback: () => {
                        require('./auth').frontLogout()
                    }
                }) 
            } else if (data.code === code.NO_PERMISSION) {
                // 未授权
                MessageBox.alert(data.msg || '您没有权限进行此项操作')
            } else {
                MessageBox.alert(data.msg || '抱歉，本次操作失败')
            }
            console.log('response:', data)

            return Promise.reject(data.msg || '操作失败')
        }

        return data
    },
    error => {
        console.log('http error:', error)
        Message.error('服务器出现未知错误')

        return Promise.reject(error)
    }
)

export default http
