<template>
	<el-container>
		<x-aside>aside</x-aside>
		<el-container>
			<el-header style="height: 80px;">
				<el-breadcrumb separator=">">
					<el-breadcrumb-item :go="{name:'home'}">首页</el-breadcrumb-item>
					<el-breadcrumb-item>管理中心</el-breadcrumb-item>
					<el-breadcrumb-item>密码管理</el-breadcrumb-item>
				</el-breadcrumb>
			</el-header>
			<el-main>
				<router-view></router-view>
			</el-main>
		</el-container>
	</el-container>
</template>

<script>
import XAside from './aside'

export default {
    components: {
        XAside
    }
}
</script>

<style lang="scss" scoped>
@import 'src/styles/variable.scss';

.el-header {
    border-bottom:1px solid $light-gray;
    .el-breadcrumb {
        height: 100%;
        line-height: 80px;
    }
}
</style>
