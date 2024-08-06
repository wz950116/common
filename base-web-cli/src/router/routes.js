const routes = [
  {
    path: '/demo',
    name: 'demo',
    component: () => import(/* webpackChunkName: "layout" */ '@/views/demo.vue')
  },
  {
    path: '/render-tmp/:ids',
    name: 'renderTmp',
    component: () => import(/* webpackChunkName: "layout" */ '@/views/renderTmp.vue')
  }
]

export default routes
