import getMenus from '@/lib/menu'

function theme(themeName) {
    return global.$conf.theme[themeName]
}

export default {
    state: {
        theme: theme(global.$conf.defaultTheme)
    },
    getters: {
        menus(sate, getters, rootState, rootGetters) {
            return getMenus(rootGetters.user)
        }
    },
    mutations: {
        CHANGE_THEME(state, theme) {
            state.theme = theme(theme)
        }
    }
}
