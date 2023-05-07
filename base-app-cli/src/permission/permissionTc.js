/*
 * @Author: zhoulf
 * @FilePath: /dg-maintenance-work-app/src/permission/permissionTc.js
 * @Date: 2022-10-14 15:13:37
 * @LastEditors: zhoulf
 * @LastEditTime: 2022-10-17 16:11:34
 * @Description:
 */
import router from '../router'
import store from '@/store'
import { getQueryString } from '@/utils'
import { addRoutes } from '@/router/generatorRouters'
import NProgress from 'nprogress' // progress bar
import 'nprogress/nprogress.css'

const code = getQueryString('code')
const clientId = getQueryString('clientId')
// const project_id = getQueryString('projectId') // projectId
const idaastoken = getQueryString('idaastoken') // 统一认证平台的token
if (idaastoken) {
  store.commit('SET_IDAASTOKEN', idaastoken)
}
export class PermissionTC {
  constructor() {
    // 本地调试模式，不加路由守卫，只获取路由信息
    router.beforeEach((to, from, next) => {
      NProgress.start()
      // 本地有三中心的token
      if (store.getters.token) {
        // 此时没有刷新
        if (store.getters.isRefresh) {
          // 检测是否刷新路由
          next()
          NProgress.done()
        } else {
          // 刷新路由
          const accessToken = store.getters.token
          const projectId = process.env.VUE_APP_PROJECTID
          store
            .dispatch('GetUserInfoByToken', { accessToken, projectId })
            .then((menu) => {
              this.getUserInfo(menu).then(() => {
                next({ ...to })
                NProgress.done()
              })
            })
            .catch(() => {
              store.dispatch('Logout').then((url) => {
                this.jumpToTcAuthUrl(url)
              })
            })
        }
      } else if (code) {
        // 连接上有三中心的code，获取accessToken
        store.dispatch('GetUserInfo', { code, clientId }).then((menu) => {
          // 登陆成功，获取用户信息及路由信息
          this.getUserInfo(menu).then((url) => {
            next(url)
            NProgress.done()
          })
        })
      } else {
        //  跳转到三中心的授权页面
        store.dispatch('Logout').then((url) => {
          this.jumpToTcAuthUrl(url)
        })
      }
    })
  }

  /**
   * 获取用户信息及菜单树
   * @param accessToken
   * @returns {Promise<string|string|*>}
   */
  async getUserInfo(menu = store.getters.menu) {
    try {
      // 获取用户信息
      await store.dispatch('GenerateRoutes', menu).then(() => {
        addRoutes()
      })
      return '/'
    } catch (e) {
      console.error(e)
      // Message({
      //   type: 'error',
      //   message: '获取用户信息失败！'
      // })
    }
  }

  /**
   * 跳转到三中心的授权页面
   */
  jumpToTcAuthUrl(url) {
    // window.location.href = process.env.VUE_APP_NAVIGATION_URL
    window.location.href = url
  }
}
