<template>
	<el-aside class="side-menu">
		<div class="logo">
			<img :src="logo">
		</div>
		<el-menu :router="true" :default-active="activeIndex">
			<template v-for="menu in menus">
				<el-menu-item v-if="!menu.children || !menu.children.length" :index="menu.path" :key="menu.path">
					<i v-if="menu.icon" :class="menu.icon"></i>
					<span slot="title">{{ menu.title }}</span>
				</el-menu-item>
				<el-submenu v-else :key="menu.path" :index="menu.path">
					<p slot="title" class="submenu-title">
						<i v-if="menu.icon" :class="menu.icon"></i>
						<span>{{ menu.title }}</span>
					</p>
					<el-menu-item v-for="child in menu.children" :key="child.path" :index="child.path">{{ child.title }}</el-menu-item>
				</el-submenu>
			</template>
		</el-menu>
	</el-aside>

</template>

<script>
import { menuIndex } from '@/lib/menu'
import logo from '@/assets/logo.png'

export default {
    data() {
        return {
			menus: this.$store.getters.menus,
			logo
        }
    },
    computed: {
        indexes() {
            return menuIndex(this.menus)
        },
        activeIndex() {
            const matches = this.$route.matched
                .map(item => item.path || '/')
                .reverse()
            for (const path of matches) {
                if (this.indexes.indexOf(path) !== -1) {
                    return path
                }
            }

            return '/'
        }
    }
}
</script>

<style lang="scss" scoped>
.side-menu {
    min-height: 900px;
    border-right: 1px solid #edf2fc;

    .el-menu {
        border-right: 0;
        .el-menu-item {
            padding-left: 40px !important;
        }
        .submenu-title {
            padding-left: 20px;
        }
        .el-submenu {
            .el-menu-item {
                padding-left: 60px !important;
            }
        }
        [class^='fa fa-'] {
            vertical-align: middle;
            margin-right: 0;
            width: 24px;
            text-align: center;
            font-size: 18px;
		}
		[class^='el-icon']{
			margin-right: 0 !important;
		}
    }
}
.logo {
    height: 80px;
    line-height: 80px;
    font-size: 40px;
	padding-left: 40px;
	overflow: hidden;
}
</style>
