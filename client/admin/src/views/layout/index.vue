<template>
	<el-container>
		<x-aside>aside</x-aside>
		<el-container>
			<el-header style="height: 80px;">
				<el-breadcrumb separator=">">
					<el-breadcrumb-item v-for="bread in breadcrumb" :to="bread.path" :key="bread.path">{{ bread.title }}</el-breadcrumb-item>
				</el-breadcrumb>
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
            routeTitles: routeTitles()
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
        }
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
}
</style>
