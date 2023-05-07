/* eslint-disable space-before-function-paren */
// 节流
import throttle from './throttle'

const positionList = []

// 滚动改变 记住滚动
const scrollChange = (el) => {
  positionList.forEach((_) => {
    if (_.el === el) {
      _.position = el.scrollTop
    }
  })
}

// 恢复滚动条
const recoverPosition = () => {
  positionList.forEach((_) => {
    _.el.scrollTop = _.position
  })
}

export default {
  name: 'keep-position',
  inserted(el, binding, vnode) {
    const vm = vnode.context
    positionList.push({
      el,
      position: 0
    })
    if (vm.$options.activated) {
      vm.$options.activated.push(function () {
        recoverPosition()
      })
    } else {
      vm.$options.activated = [
        function () {
          recoverPosition()
        }
      ]
    }
    const handler = throttle(scrollChange, 500)
    el.onscroll = () => {
      handler(el)
    }
  },
  unbind(el) {
    el.onscroll = null
  }
}
