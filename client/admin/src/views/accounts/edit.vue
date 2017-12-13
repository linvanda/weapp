<template>
    <el-row>
        <el-col :span="formWidth">
            <el-form :model="user" ref="form" label-width="80px" :rules="rules" v-loading="!!$store.state.loading">
                <el-form-item label="账号" prop="account">{{ user.account }}</el-form-item>
                <el-form-item label="姓名" prop="name">
                    <el-input v-model="user.name"></el-input>
                </el-form-item>
                <el-form-item label="邮箱" prop="email">
                    <el-input v-model="user.email"></el-input>
                </el-form-item>
                <el-form-item label="手机" prop="mobile">
                    <el-input v-model="user.mobile"></el-input>
                </el-form-item>
                <el-form-item label="角色" prop="roles">
                    <el-checkbox-group v-model="user.roles">
                        <el-checkbox :label="adminRole.key" :key="adminRole.key" @change="chooseAdmin">{{ adminRole.name }}</el-checkbox>
                    </el-checkbox-group>
                    <el-checkbox-group v-model="user.roles" :disabled="!roleCanChoose" class="checkbox">
                        <el-checkbox v-for="role in roleList" :label="role.key" :key="role.key">{{ role.name }}</el-checkbox>
                    </el-checkbox-group>
                </el-form-item>
                <div class="form-btn">
                    <el-button @click="$router.back()">返回</el-button>
                    <el-button @click="submit('form')" type="primary" :loading="!!$store.state.doing">提交</el-button>
                </div>
            </el-form>
        </el-col>
    </el-row>
</template>

<script>
import API from '@/api'

export default {
    props: {
        id: ''
    },
    data() {
        return {
            formWidth: global.$conf.formWidth,
            user: {
                account: '',
                name: '',
                email: '',
                mobile: '',
                roles: []
            },
            adminRole: {},
            roleList: [],
            rules: {
                name: [{ required: true, message: '请输入姓名', trigger: 'blur' }],
                email: [
                    { type: 'email', message: '请输入正确的 email', trigger: 'blur' }
                ],
                roles: [
                    { required: true, message: '请至少选择一个角色' }
                ]
            }
        }
    },
    computed: {
        roleCanChoose() {
            return this.user.roles.indexOf(global.$conf.superRole) === -1
        }
    },
    methods: {
        fetchData() {
            console.log('90d')
            API.loading()
                .invoke('account.info', this.id)
                .then(user => {
                    Object.assign(this.user, user)
                })
            API.invoke('permission.simpleRoleList').then(roles => {
                // 超级管理员
                this.adminRole = roles.filter(
                    item => item.key === global.$conf.superRole
                )[0]

                // 普通角色列表
                this.roleList = roles.filter(
                    item => item.key !== global.$conf.superRole
                )
            })
        },
        submit(form) {
            this.$refs[form].validate(valid => {
                if (valid) {
                    API.doing().invoke('account.edit', Object.assign({ id: this.id }, this.user)).success()
                }
            })
        },
        chooseAdmin(val) {
            if (val === true) {
                this.user.roles = [global.$conf.superRole]
            }
        }
    },
    created() {
        this.fetchData()
    }
}
</script>

