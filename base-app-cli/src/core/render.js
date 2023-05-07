/*
 * @Author: zhoulf
 * @FilePath: /jzygf-municipal-app/src/core/render.js
 * @Date: 2023-03-20 17:05:32
 * @LastEditors: zhoulf
 * @LastEditTime: 2023-03-20 17:42:09
 * @Description:
 */
import Vue from 'vue'
import App from '../App.vue'
import router from '../router'
import store from '../store'
const render = () => {
  new Vue({
    router,
    store,
    render: (h) => h(App)
  }).$mount('#app')
}
export default render
