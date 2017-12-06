<template>
	<div id="app">
		<!-- <link rel="stylesheet" :href="themeCssFile"> -->
		<router-view/>
	</div>
</template>

<script>
export default {
    name: 'app'
}
</script>

<style lang="scss">
body {
    font-family: 'Lucida Grande', Lucida Sans Unicode, Hiragino Sans GB,
        WenQuanYi Micro Hei, Verdana, Aril, sans-serif;
    outline: none;
}
.el-input {
	.fa{
		width:20px;
		line-height: 40px;
	}
}
#app{
	padding-bottom: 80px;
}
</style>
