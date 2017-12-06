import Vue from 'vue'
import Vuex from 'vuex'
import app from './modules/app'
import user from './modules/user'
import getters from './getters'

Vue.use(Vuex)

export default new Vuex.Store({
    state: {
        shouldLoading: false,
        loading: false
    },
    modules: {
        app,
        user
    },
    getters,
    mutations: {
        START_LOADING(state) {
            if (state.shouldLoading) {
                state.loading = true
            }
        },
        END_LOADING(state) {
            state.shouldLoading = false
            state.loading = false
        },
        SHOULD_LOADING(state, flag) {
            state.shouldLoading = flag
        }
    }
})
