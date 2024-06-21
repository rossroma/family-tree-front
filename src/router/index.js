import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/layout'

/**
 * Note: sub-menu only appear when route children.length >= 1
 * Detail see: https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
 *
 * hidden: true                   if set true, item will not show in the sidebar(default is false)
 * alwaysShow: true               if set true, will always show the root menu
 *                                if not set alwaysShow, when item has more than one children route,
 *                                it will becomes nested mode, otherwise not show the root menu
 * redirect: noRedirect           if set noRedirect will no redirect in the breadcrumb
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * meta : {
    roles: ['admin','editor']    control the page roles (you can set multiple roles)
    title: 'title'               the name show in sidebar and breadcrumb (recommend set)
    icon: 'svg-name'/'el-icon-x' the icon show in the sidebar
    breadcrumb: false            if set false, the item will hidden in breadcrumb(default is true)
    activeMenu: '/example/list'  if set path, the sidebar will highlight the path you set
  }
 */

/**
 * constantRoutes
 * a base page that does not have permission requirements
 * all roles can be accessed
 */
export const constantRoutes = [
  {
    path: '/login',
    name: 'Login',
    component: () => import(/* webpackChunkName: "login" */ '@/views/login/index'),
    hidden: true
  },

  {
    path: '/404',
    name: '404',
    component: () => import(/* webpackChunkName: "404" */ '@/views/404'),
    hidden: true
  },

  {
    path: '/admin',
    component: Layout,
    redirect: '/admin/table',
    meta: { title: '管理后台', icon: 'table' },
    children: [
      {
        path: '/admin/table',
        name: 'Table',
        component: () => import(/* webpackChunkName: "table" */ '@/views/table/index'),
        meta: { title: '家谱管理', icon: 'example' },
      }, {
        path: '/admin/edit',
        name: 'Edit',
        component: () => import(/* webpackChunkName: "edit" */ '@/views/form/index'),
        meta: { title: '编辑', icon: 'form' },
        hidden: true
      },
      {
        path: '/admin/user',
        component: () => import(/* webpackChunkName: "user" */ '@/views/user/index'),
        name: 'User',
        meta: { title: '用户管理', icon: 'user' },
      },
      {
        path: '/admin/userEdit',
        component: () => import(/* webpackChunkName: "userEdit" */ '@/views/user/components/edit'),
        name: 'UserEdit',
        hidden: true,
        meta: { title: '编辑用户', icon: 'user' },
      }
    ]
  },
  {
    path: '/',
    component: () => import('@/views/home/index'),
    redirect: '/tree',
    meta: { title: '首页', icon: 'eye' },
    hidden: true,
    children: [{
      path: 'tree',
      name: 'Tree',
      component: () => import(/* webpackChunkName: "tree" */ '@/views/home/tree'),
      meta: { title: '树状图' },
      hidden: true
    }, {
      path: 'sun',
      name: 'Sun',
      component: () => import(/* webpackChunkName: "sun" */ '@/views/home/sun'),
      meta: { title: '落日图' },
      hidden: true
    }]
  },
  {
    path: '/mobile',
    component: () => import(/* webpackChunkName: "mobile" */ '@/views/mobile/index'),
    meta: { title: '展示', icon: 'table' },
    hidden: true
  },

  // 404 page must be placed at the end !!!
  { path: '*', redirect: '/404', hidden: true }
]

const createRouter = () => new Router({
  mode: 'history', // require service support
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRoutes
})

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router
