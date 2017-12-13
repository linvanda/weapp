<template>
    <div>
        <el-row>
            <el-col :span="formWidth" v-loading="!!$store.state.loading">
                <el-tabs v-model="activeTab">
                    <el-tab-pane label="信息" name="info">
                        <el-form :model="role" ref="info" label-width="60px" :rules="rules">
                            <el-form-item label="名称" prop="name">
                                <el-input v-model="role.name"></el-input>
                            </el-form-item>
                        </el-form>
                    </el-tab-pane>
                    <el-tab-pane label="用户" name="users">
                        <el-form :model="role" ref="users" label-width="20px" :rules="rules">
                            <el-form-item label="" prop="users" class="full-transfer">
                                <el-transfer 
                                    class="transfer"
                                    filterable 
                                    :filter-method="filterUsers"
                                    filter-placeholder="用户姓名或账号"
                                    v-model="role.users"
                                    :data="users"
                                    :props="{ key: 'id', label: 'display' }"
                                    :titles="['全部用户', '已选择']">
                                </el-transfer>
                            </el-form-item>
                        </el-form>
                    </el-tab-pane>
                    <el-tab-pane label="授权" name="action">
                        <el-form :model="role" ref="action" label-width="20px" :rules="rules">
                            <el-form-item label="" prop="actions">
                                <check-all v-for="(action, index) in actions" :key="index" :items="action.actions" :checked.sync="role.actions" :title="action.group"></check-all>
                            </el-form-item>
                        </el-form>
                    </el-tab-pane>
                </el-tabs>
            </el-col>
        </el-row>
        <el-row>
            <el-col :span="formWidth" class="form-btn">
                <el-button @click="$router.back()">返回</el-button>
                <el-button @click="submit('form')" type="primary" :loading="!!$store.state.doing">保存</el-button>
            </el-col>
        </el-row>
    </div>
</template>

<script>
import API from '@/api'
import CheckAll from '@/components/CheckAll'

export default {
    components: {
        CheckAll
    },
    props: {
        id: ''
    },
    data() {
        return {
            formWidth: global.$conf.formWidth,
            activeTab: 'info',
            role: {
                name: '',
                users: [],
                actions: []
            },
            users: [],
            actions: [],
            rules: {
                name: [
                    { required: true, message: '请输入角色名称' }
                ]
            }
        }
    },
    methods: {
        filterUsers(query, item) {
            query = query.trim()
            return item.name.indexOf(query) > -1 || item.account.toLowerCase().indexOf(query.toLowerCase()) > -1
        }
    },
    created() {
        // 角色详情
        API.loading().invoke('permission.roleInfo', this.id)
        .then(role => {
            this.role = {
                name: role.name,
                users: role.users.map(item => item.id),
                actions: role.actions.map(item => item.id)
            }
        })

        // 所有用户列表
        API.invoke('account.simpleList')
        .then(users => {
            this.users = users.map(item => {
                item.display = `${item.name} (${item.account})`

                return item
            })
        })

        // actions 列表
        API.invoke('permission.simpleActionList')
        .then(actions => {
            this.actions = actions
        })
    }
}
</script>

