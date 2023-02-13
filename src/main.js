import Vue from 'vue'

import 'normalize.css/normalize.css' // A modern alternative to CSS resets
import '@/styles/index.scss' // global css

import App from './App'
import store from './store'
import router from './router'

import '@/icons' // icon
import '@/permission' // permission control

import { Form, FormItem, Input, Select, Option, Button, ButtonGroup, Divider,
  Dropdown, DropdownMenu, DropdownItem, Menu, MenuItem, Submenu,
  Table, TableColumn, Popover, Pagination,
  Breadcrumb, BreadcrumbItem, Dialog, Slider
} from 'element-ui'

Vue.use(Button)
Vue.use(ButtonGroup)
Vue.use(Select)
Vue.use(Input)
Vue.use(Table)
Vue.use(Breadcrumb)
Vue.use(BreadcrumbItem)
Vue.use(Dropdown)
Vue.use(DropdownMenu)
Vue.use(Menu)
Vue.use(Submenu)
Vue.use(MenuItem)
Vue.use(Divider)
Vue.use(Option)
Vue.use(DropdownItem)
Vue.use(TableColumn)
Vue.use(Slider)
Vue.use(Form)
Vue.use(Dialog)
Vue.use(Popover)
Vue.use(Pagination)
Vue.use(FormItem)

/** Pagination
 * If you don't want to use mock-server
 * you want to use MockJs for mock api
 * you can execute: mockXHR()
 *
 * Currently MockJs will be used in the production environment,
 * please remove it before going online ! ! !
 */
if (process.env.NODE_ENV === 'production') {
  const { mockXHR } = require('../mock')
  mockXHR()
}

Vue.config.productionTip = false

new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})
