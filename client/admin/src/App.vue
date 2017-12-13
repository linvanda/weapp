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
}
* {
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
.form-btn{
	text-align: center;
	padding-top:40px;
	.el-button{
		width: 120px;
	}
}
.full-transfer {
	.el-transfer{
        .el-transfer-panel{
            width: 300px;
            .el-transfer-panel__body{
                height: 420px;
                .el-transfer-panel__list{
                    height: 350px;
                }
            }
        }
    }  
}
.el-checkbox-group.checkbox{
    .el-checkbox{
        margin-left: 0;
        margin-right: 30px;
    }
}
</style>
