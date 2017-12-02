/**
 * 用户数据
 */
import persist from '@/lib/persist'

export default {
    state: {
        id: '',
        token: persist.get('token'),
        name: '',
        account: '',
        email: ''
    },
    mutations: {
        SET_TOKEN(state, token) {
            persist.set('token', token)
            state.token = token
        },
        SET_USERINFO(state, { id, name, account, email }) {
            state.id = id
            state.name = name
            state.account = account
            state.email = email
        }
    },
    actions: {
        // 由于登录和登出除了从服务器获取数据并设置到 store，还有额外的业务逻辑，因而业务不放在这里，此处仅仅设置相关数据
        Login({ commit }, { token }) {
            commit('SET_TOKEN', token)
        },
        Logout({ commit }) {
            commit('SET_TOKEN', {})
            commit('SET_USERINFO', {
                id: '',
                name: '',
                account: '',
                email: ''
            })
        }
    }
}
