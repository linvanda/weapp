import getMenus from '@/lib/menu'

function theme(themeName) {
    return global.$conf.theme[themeName]
}

export default {
    state: {
        // 主题
        theme: theme(global.$conf.defaultTheme)
    },
    getters: {
        // 菜单
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
