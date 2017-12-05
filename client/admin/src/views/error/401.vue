<template>
	<div>
		<el-row type="flex" justify="center">
			<el-col :span="12" class="error-content">
				<h1 class="text-jumbo">Oops!</h1>
				<h2 class="tip">你没有权限访问该页面</h2>
				<div class="op">
					<el-button @click="back" type="primary">
						<i class="el-icon-arrow-left"></i>返回</el-button>
					<el-button @click="$router.replace({name:'home'})">
						去首页
						<i class="el-icon-arrow-right"></i>
					</el-button>
				</div>
			</el-col>
		</el-row>
	</div>
</template>

<script>
export default {
    methods: {
        back() {
            if (this.$route.query.noGoBack) {
                this.$router.push({ name: 'home' })
            } else {
                this.$router.go(-1)
            }
        }
    }
}
</script>

<style lang="scss" scoped>
.error-content {
    text-align: center;
    padding-top: 180px;
    .text-jumbo {
        font-size: 6em;
        color: #444;
        margin: 10px 0 !important;
    }
    .tip {
        color: #666;
        font-size: 1.6em;
    }
    .op {
        margin-top: 40px;
    }
}
</style>
