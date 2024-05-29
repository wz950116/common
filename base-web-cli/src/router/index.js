import Vue from 'vue'
import VueRouter from 'vue-router'
import routes from './routes.js'
Vue.use(VueRouter)

const router = new VueRouter({
  mode: 'history',
  base: '',
  routes,
  scrollBehavior(to) {
    if (to.meta.scroll) {
      return { x: 0, y: 0 }
    }
  }
})

export default router
