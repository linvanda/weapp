<template>
    <el-container>
        <x-aside></x-aside>
        <el-container>
            <el-header style="height: 80px;">
                <el-row>
                    <el-col :span="18">
                        <el-breadcrumb separator=">">
                            <el-breadcrumb-item v-for="bread in breadcrumb" :to="bread.path" :key="bread.path">
                                {{ bread.title }}
                            </el-breadcrumb-item>
                        </el-breadcrumb>
                    </el-col>
                    <el-col :span="6" class="userinfo">
                        <div class="time">{{ now }}</div>
                        <el-dropdown @command="userCommand">
                            <span class="el-dropdown-link">
                                {{ user.name || user.account }}，你好
                                <i class="el-icon-arrow-down el-icon--right"></i>
                            </span>
                            <el-dropdown-menu slot="dropdown">
                                <el-dropdown-item command="user-setting">账号设置</el-dropdown-item>
                                <el-dropdown-item command="system-setting">系统设置</el-dropdown-item>
                                <el-dropdown-item divided command="logout">退出登录</el-dropdown-item>
                            </el-dropdown-menu>
                        </el-dropdown>
                    </el-col>
                </el-row>
            </el-header>
            <el-main style="padding:40px;">
                <router-view></router-view>
            </el-main>
        </el-container>
    </el-container>
</template>

<script>
import XAside from './aside'
import { routeTitles } from '@/lib/menu'

export default {
    components: {
        XAside
    },
    data() {
        return {
            routeTitles: routeTitles(),
            now: new Date().toLocaleString()
        }
    },
    computed: {
        breadcrumb() {
            let matched = this.$route.matched
                .filter(item => item.name && this.routeTitles[item.name])
                .map(item => {
                    item['title'] = this.routeTitles[item.name]
                    return item
                })

            if (!matched.length || matched[0].name !== 'home') {
                matched = [{ title: '首页', path: '/' }].concat(matched)
            }

            return matched
        },
        user() {
            return this.$store.getters.user
        }
    },
    methods: {
        userCommand(command) {
            switch (command) {
                case 'user-setting':
                    this.$router.push({ name: 'account-edit', params: { id: this.user.id } })
                    break
                case 'system-setting':
                    this.$router.push({ name: 'setting', params: { id: this.user.id } })
                    break
                case 'logout':
                    this.$store.dispatch('Logout').then(() => {
                        location.reload()
                        this.$router.push(global.$conf.logoutRedirectUrl)
                    })
            }
        }
    },
    created() {
        setInterval(() => {this.now = new Date().toLocaleString()}, 1000)
    }
}
</script>

<style lang="scss" scoped>
@import 'src/styles/variable.scss';

.el-header {
    border-bottom: 1px solid $light-gray;
    .el-breadcrumb {
        height: 100%;
        line-height: 80px;
    }
    .userinfo {
        text-align: right;
        height: 80px;
        padding-top: 30px;
        position:relative;
        .time {
            left:0;
            display: inline-block;
            position: absolute!important;
            color: #5a5e66;
            font-size: 14px;
        }
        .el-dropdown {
            right: 0;
            position: absolute!important;
        }
    }
}
</style>
