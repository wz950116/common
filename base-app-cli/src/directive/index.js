import keepScroll from './keepScroll'

export const directives = {
  keepScroll
}
export default {
  install(Vue) {
    Object.keys(directives).forEach((key) => {
      Vue.directive(directives[key].name || key, directives[key])
    })
  }
}
