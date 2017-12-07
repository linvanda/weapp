/**
 * 用户数据
 */
import persist from '@/lib/persist'
import API from '@/api'

export default {
    state: {
        id: '',
        token: persist.get('token'),
        name: '',
        account: '',
        email: ''
    },
    getters: {
        token: state => {
            const token = state.token

            if (
                token &&
                token.value &&
                token.expire &&
                new Date(token.expire.split(' ')[0]) > new Date()
            ) {
                return token.value
            }

            return ''
        },
        logined(state) {
            const token = state.token
            return !!(
                token &&
                token.value &&
                token.expire &&
                new Date(token.expire.split(' ')[0]) > new Date()
            )
        },
        user(state) {
            return state
        }
    },
    mutations: {
        SET_TOKEN(state, token) {
            persist.set('token', token)
            state.token = token
        },
        SET_USERINFO(state, user) {
            Object.assign(state, user)
        }
    },
    actions: {
        Login({ commit }, { account, password, autoLogin }) {
            return new Promise(resolve => {
                API.invoke('session.login', {
                    account,
                    password,
                    autoLogin
                }).then(loginer => {
                    commit('SET_TOKEN', loginer.token)
                    resolve(loginer)
                })
            })
        },
        Logout() {
            return new Promise(resolve => {
                API.invoke('session.logout').then(() => {
                    this.dispatch('FrontLogout').then(() => resolve())
                })
            })
        },
        FrontLogout({ commit }) {
            return new Promise(resolve => {
                commit('SET_TOKEN', {})
                commit('SET_USERINFO', {
                    id: '',
                    name: '',
                    account: '',
                    email: ''
                })

                resolve()
            })
        },
        LoginerInfo({ commit }) {
            return new Promise((resolve, reject) => {
                if (!this.getters.token) {
                    return reject('no token')
                }
                
                API.invoke('session.loginerInfo', this.getters.token).then(data => {
                    commit('SET_USERINFO', data)

                    resolve(data)
                })
            })
        }
    }
}
