const routes = [
  {
    path: '/demo',
    name: 'demo',
    component: () => import(/* webpackChunkName: "layout" */ '@/views/demo.vue')
  }
]

export default routes
