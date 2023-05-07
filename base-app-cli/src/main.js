import Vue from 'vue'
// 框架
import './core/use'
// 公用组件
import components from './core/component'
// 指令
import directive from './directive'
// 样式
import './styles/index.scss'
// 权限
import { initPermissionInstance } from '@/permission/permissionFactory'
// 调试
import VConsole from 'vconsole'
if (process.env.NODE_ENV !== 'production') {
  const vconsole = new VConsole()
  console.log(vconsole, 'console')
}
// const vconsole = new VConsole()
// console.log(vconsole, 'console')
// console.log(process.env.NODE_ENV)

Vue.use(components)
Vue.use(directive)

Vue.config.productionTip = false

Vue.prototype.$cci = window.cci

Vue.prototype.$L = window.L

initPermissionInstance('ONE')
