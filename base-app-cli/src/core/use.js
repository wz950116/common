import Vue from 'vue'
import cm, { Storage } from '@cm/cm-lib'
import 'amfe-flexible/index.js'
import CMMUi from '@cm/cm-mobile-ui'
import '@cm/cm-mobile-ui/lib/index.css'
// cci mcui 移动端ui框架
import MCui from '@cci/mcui/lib/index'
import '@cci/mcui/lib/index.css'

Vue.prototype.$storage = new Storage('sessionStorage', 'jzyge-mqwb-app')
window.$storage = new Storage('sessionStorage', 'jzyge-mqwb-app')

Vue.use(CMMUi)
Vue.use(MCui)
Vue.use(cm)
