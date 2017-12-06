<template>
	<div class="error">
		<div class="error-content">
			<h1 class="text-jumbo">Sorry!</h1>
			<h2 class="tip">您访问的页面不存在，请检查您输入的网址是否正确</h2>
			<div class="op">
				<el-button @click="back" type="primary">
					<i class="el-icon-arrow-left"></i>返回</el-button>
				<el-button @click="$router.replace({name:'home'})">
					去首页
					<i class="el-icon-arrow-right"></i>
				</el-button>
			</div>
		</div>
	</div>
</template>

<script>
export default {
    data() {
        return {
            themeColor: this.$store.state.app.theme.color
        }
    },
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
.error {
	display: block;
	text-align: center;
    .error-content {
		display:inline-block;
		width:auto;
        text-align: left;
        padding-top: 180px;
        .text-jumbo {
            font-size: 6em;
			color: #2d2f33;
			font-weight: bold;
            margin: 10px 0 !important;
        }
        .tip {
            font-size: 1.6em;
			color: #5a5e66;
			font-weight: normal;
        }
        .op {
            margin-top: 40px;
        }
    }
}
</style>
