import Vue from 'vue'
import VueRouter from 'vue-router'
import innerRoute from './static/inner'

Vue.use(VueRouter)

let routes = []
// 将白名单静态文件放到静态路由
routes = routes.concat(innerRoute)
const router = new VueRouter({
  mode: 'history',
  base: process.env.VUE_APP_BASEURL,
  routes
})

export default router
