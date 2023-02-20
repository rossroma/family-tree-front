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
  Breadcrumb, BreadcrumbItem, Dialog, Slider, Scrollbar, Link, Loading
} from 'element-ui'

Vue.use(Scrollbar)
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
Vue.use(Link)
Vue.use(Loading)
Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
