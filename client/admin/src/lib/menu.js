import router from '@/router'

/**
 * 根据用户拥有的角色和权限获取需要展示的菜单。
 * - 菜单固定为两级，对应路由中的头两层。
 * - 如果上一级的 isMenu !== true，则认为下级的都不是菜单
 * - 菜单路由最多允许三级，且只允许在最后一级设置权限信息
 * - 如果下级路由的所有权限校验都失败，则不显示上级菜单
 * - admin 角色用户拥有所有权限点，即超级管理员
 * - 没有配置 roles 和 actions 的路由视为无需权限校验
 * @param {object} user 
 */
export function getMenusByUser(user) {
    if (!user || !user.id || !user.roles || !user.roles.length) {
        return []
    }

    return getPermitedMenu(router.routes, user)
}

function getPermitedMenu(routes, user) {
    if (!routes || !routes.length || routes.isMenu !== true) {
        return []
    }

    let menus = []
    routes.forEach(route => {
        if (
            route.isMenu && 
            route.isMenu === true && 
            valid(route.meta, user)
        ) {
            // 权限校验成功，如果有子菜单，还要检验子菜单
            let ok = true
            let childrenMenus = null
            if (route.children) {
                childrenMenus = getPermitedMenu(route.children, user)

                // 当子菜单返回空时，需要根据情况决定是否显示父菜单：
                // 如果子菜单中有任何一个路由有权限，则仍然需要显示父菜单
                if (!childrenMenus.length && !hasAnyPermitedRoute(route.children, user)) {
                    ok = false
                }
            }

            if (ok) {
                let item = {
                    path: route.path,
                    title: route.title || route.name,
                    icon: route.icon || ''
                }

                if (childrenMenus) {
                    item['children'] = childrenMenus
                }

                menus.push(item)
            }
        }
    })

    return menus
}

/**
 * @param {object} meta 
 * @param {object} user 
 */
function valid(meta, user) {
    const needRoles = meta.roles || []
    const needActions = meta.actions || []
    const userRoles = user.roles || []
    const userActions = user.actions || []

    if (isAdmin(user) || (empty(needRoles) && empty(needActions))) {
        return true
    }

    if (empty(userRoles) && empty(userActions)) {
        return false
    }

    return hasAny(needRoles, userRoles) && hasAny(needActions, userActions)
}

/**
 * sources 中是否有任何符合 needs要求的
 * @param {array} needs 
 * @param {array} sources 
 */
function hasAny(needs, sources) {
    for (const need of needs) {
        if (sources.indexOf(need) !== -1) {
            return true
        }
    }

    return false
}

/**
 * 是否有任何一个路由可以访问
 * @param {object} routes 
 * @param {object} user 
 */
function hasAnyPermitedRoute(routes, user) {
    if (!routes) {
        return false
    }

    for (const route of routes) {
        if (valid(route.meta, user)) {
            return true
        }
    }

    return false
}

function isAdmin(user) {
    user.roles.indexOf(global.$conf.superRole) !== -1
}

function empty(val) {
    return !val || !val.length
}
