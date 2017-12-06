import axios from 'axios'
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

export default http
