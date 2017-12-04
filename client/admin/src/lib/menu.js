import { routes } from '@/router'
import { hasAny, empty, isAdmin } from '@/lib/util'
import path from 'path'

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
function getMenusByUser(user) {
    if (!user || !user.id) {
        return []
    }

    return getPermitedMenu(routes, user)
}

function getPermitedMenu(routes, user, basePath = '') {
    if (empty(routes)) {
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
                childrenMenus = getPermitedMenu(route.children, user, path.join(basePath, route.path))

                // 当子菜单返回空时，需要根据情况决定是否显示父菜单：
                // 如果子菜单中有任何一个路由有权限，则仍然需要显示父菜单
                if (!childrenMenus.length && (hasGrandSun(route.children) || !hasAnyPermitedRoute(route.children, user))) {
                    ok = false
                }
            }

            if (ok) {
                let item = {
                    path: path.join(basePath, route.path),
                    title: route.title || route.name || '',
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
    meta = meta || {}
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

    return hasAny(userRoles, needRoles) || hasAny(userActions, needActions)
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

/**
 * 是否有孙节点
 * @param {array} children 
 */
function hasGrandSun(children) {
    if (empty(children)) {
        return false
    } 

    for (const item of children) {
        if (!empty(item.children)) {
            return true
        }
    }

    return false
}

export default getMenusByUser

/**
 * 菜单的 index （完整 path）
 * @param {array} menus 
 */
export function menuIndex(menus) {
    let indexes = []

    menus.forEach(menu => {
        indexes.push(menu.path)

        if (!empty(menu.children)) {
            indexes = indexes.concat(menuIndex(menu.children))
        }
    })

    return indexes
}

/**
 * 路由的 title 信息
 */
export function routeTitles(_routes) {
    _routes = _routes || routes
    let titles = {}

    _routes.forEach(route => {
        if (route.name && route.title) {
            titles[route.name] = route.title

            if (!empty(route.children)) {
                Object.assign(titles, routeTitles(route.children))
            }
        }
    })

    return titles
}
