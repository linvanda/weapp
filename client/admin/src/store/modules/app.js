function getTheme(themeName) {
    return global.$conf.theme[themeName]
}

export default {
    state: {
        theme: getTheme(global.$conf.defaultTheme)
    },
    mutations: {
        CHANGE_THEME(state, theme) {
            state.theme = getTheme(theme)
        }
    }
}
