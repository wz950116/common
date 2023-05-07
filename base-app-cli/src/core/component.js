// 全局注册nav组件等
import CmbNav from '@/layout/CmbNav'
import header from '@/components/header'

export const component = {
  CmbNav,
  myHeader: header
}

export default {
  install(Vue) {
    Object.keys(component).forEach((key) => {
      Vue.component(component[key].name || key, component[key])
    })
  }
}
