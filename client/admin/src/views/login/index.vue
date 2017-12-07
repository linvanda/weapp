<template>
    <el-row class="login" type="flex" justify="center">
        <el-col :span="5">
            <h2>系统登录</h2>
            <el-form :model="login" :rules="rules" ref="loginForm">
                <el-form-item label="" prop="account">
                    <el-input placeholder="账号" v-model="login.account"></el-input>
                </el-form-item>
                <el-form-item label="" prop="password">
                    <el-input placeholder="密码" type="password" v-model="login.password"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-checkbox v-model="login.autoLogin">30 天自动登录</el-checkbox>
                </el-form-item>
                <el-form-item class="submit">
                    <el-button type="primary" @click="submit('loginForm')">登录</el-button>
                </el-form-item>
            </el-form>
        </el-col>
    </el-row>
</template>

<script>
export default {
    data() {
        return {
            login: {
                account: '',
                password: '',
                autoLogin: 0
            },
            rules: {
                account: [
                    { required: true, message: '请输入账号', trigger: 'blur' }
                ],
                password: [
                    { required: true, message: '请输入密码', trigger: 'blur' }
                ]
            }
        }
    },
    methods: {
        submit(formName) {
            this.$refs[formName].validate(valid => {
                if (valid) {
                    this.$store
                        .dispatch('Login', {
                            account: this.login.account,
                            password: this.login.password,
                            autoLogin: this.login.autoLogin
                        })
                        .then(() => {
                            this.$store.dispatch('initApp').then(getters => {
                                // 引入主题文件
                                document.getElementById(
                                    'theme-css-link'
                                ).href = getters.theme.path
                            })

                            // 跳转到相关页面
                            this.$router.replace(global.$conf.loginRedirectUrl)
                        })
                }
            })
        }
    }
}
</script>

<style lang="scss" scoped>
.login {
    margin-top: 140px;
}
.submit {
    text-align: center;
    .el-button {
        width: 100%;
        margin: 0 auto;
    }
}
</style>
