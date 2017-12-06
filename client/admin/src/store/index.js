import Vue from 'vue'
import Vuex from 'vuex'
import app from './modules/app'
import user from './modules/user'
import getters from './getters'

Vue.use(Vuex)

export default new Vuex.Store({
    state: {
        loading: false
    },
    modules: {
        app,
        user
    },
    getters,
    mutations: {
        START_LOADING(state, val) {
            state.loading = val
        },
        STOP_LOADING(state) {
            state.loading = false
        }
    }
})
