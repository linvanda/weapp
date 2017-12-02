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
import { login } from '@/lib/auth'

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
			this.$refs[formName].validate((valid) => {
				if (valid) {
					login(this.login.account, this.login.password, this.login.autoLogin)
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
