const innerRoute = [
  {
    url: '/',
    path: '/',
    name: 'home',
    component: () => import('@/views/home.vue'),
    meta: {
      title: '首页'
    }
  }
]
export default innerRoute
