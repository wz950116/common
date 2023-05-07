import router from '.'
import { treeToList } from '@/utils'
import pages from './static/pages'
import store from '@/store'

const getMenu = (menu = []) => {
  menu.forEach(node => {
    const findPage = pages.find(item => item.url === node.url)
    let page = node.url
    if (findPage) {
      page = findPage.page
    }
    router.addRoute({
      url: node.url || null,
      path: node.url || null,
      name: node.name || null,
      meta: node.meta || null,
      component: node.url && node.url !== '/' ? (resolve) => require([`@/views/${page}`], resolve)
        : null,
      icon: node.icon || null,
      id: node.id || null
    })
  })
  router.addRoute({
    path: '/:path(.*)*',
    name: 'NotFound',
    hidden: true,
    component: () => import('@/views/home')
  })
}
export const generateRoutes = (menu) => {
  const items = treeToList(menu)
  console.log(items, 'menu')
  getMenu(items)
}
export async function addRoutes() {
  return new Promise(resolve => {
    const menu = store.getters.menu
    generateRoutes(menu)
    resolve()
  })
}
