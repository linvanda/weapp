import getMenus from '@/lib/menu'
import API from '@/api'

export default {
    state: {
        // 主题
        theme: global.$conf.defaultTheme
    },
    getters: {
        // 菜单
        menus(state, getters, rootState, rootGetters) {
            return getMenus(rootGetters.user)
        },
        theme(state) {
            return global.$conf.theme[state.theme]
        }
    },
    mutations: {
        INIT(state, config) {
            config.theme && (state.theme = config.theme)
        }
    },
    actions: {
        initApp({ commit, getters, rootGetters }) {
            return new Promise(resolve => {
                function init(user) {
                    // 存在用户信息才加载个性化配置
                    API.noIntercept().invoke('setting.info', user.id).then(data => {
                        if (data.code === 1000) {
                            commit('INIT', data.data)
                        } else {
                            console.log('get setting error.result:' + JSON.stringify(data))
                        }

                        resolve(getters)
                    })
                }

                if (!rootGetters.user.id) {
                    this.dispatch('LoginerInfo').then(user => {
                        init(user)
                    }).catch(() => {
                        resolve(getters)
                    })
                } else {
                    init(rootGetters.user.id)
                }
            })
        }
    }
}
