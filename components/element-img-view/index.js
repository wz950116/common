import Vue from 'vue'
import imageViewer from './src/container.vue'
const Constructor = Vue.extend(imageViewer)
const instance = new Constructor()

export const $imageViewer = (function() {
  instance.vm = instance.$mount()
  document.body.appendChild(instance.vm.$el)
  instance.dom = instance.vm.$el
  return instance.vm
})()

// 使用 this.$imageViewer.show([url....])
