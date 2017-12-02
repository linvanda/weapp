export default {
    token: state => {
        const token = state.user.token

        if (token && token.value && token.expire && new Date(token.expire.split(' ')[0]) > new Date()) {
            return token.value
        }

        return ''
    },
    logined(state) {
        const token = state.user.token
        return !!(token && token.value && token.expire && new Date(token.expire.split(' ')[0]) > new Date())
    }
}
