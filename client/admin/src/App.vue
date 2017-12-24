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
@import 'src/styles/variable.scss';

body {
    font-family: "Helvetica Neue", "Hiragino Sans GB", "Microsoft YaHei", "\9ED1\4F53", Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    font-size: 14px;
}

/*reset*/
body,div,dl,dt,dd,ul,ol,li,h1,h2,h3,h4,h5,h6,pre, 
form,fieldset,input,textarea,p,blockquote,th,td { 
    padding: 0; 
    margin: 0; 
    outline: none;
    box-sizing: border-box;
} 
table { 
    border-collapse: collapse; 
    border-spacing: 0; 
} 
fieldset,img { 
    border: 0; 
} 
address,caption,cite,code,dfn,th,var { 
    font-weight: normal; 
    font-style: normal; 
} 
ol,ul { 
    list-style: none; 
} 
caption,th { 
    text-align: left; 
} 
h1,h2,h3,h4,h5,h6 { 
    font-weight: normal; 
    font-size: 100%; 
} 
q:before,q:after { 
    content:”; 
} 
abbr,acronym { 
    border: 0; 
}

.quill-editor {
    background-color: white;
    .ql-editor {
        min-height: 500px;
    }
}

.el-input {
	.fa{
		width:20px;
		line-height: 40px;
    }
}
.short-form {
    .el-input, .el-textarea {
        width: 60%;
    }
}
#app{
	padding-bottom: 80px;
}
.form-btn{
	text-align: center;
	padding-top:40px;
	.el-button{
		width: $btn-big;
	}
}
.el-button {
    &.large {
        width: $btn-big;
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
.empty {
    text-align: center;
    color: $font-aide;
    padding-top: $padding-three;
    padding-bottom: $padding-three;
}
</style>
