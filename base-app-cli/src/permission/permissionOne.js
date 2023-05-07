import store from '@/store'
import { getQueryString } from '@/utils'
import { addRoutes } from '@/router/generatorRouters'
import 'nprogress/nprogress.css'
import render from '@/core/render'

const accessToken = getQueryString('accessToken')
const userId = getQueryString('userId')
const userName = getQueryString('userName')
const deptId = getQueryString('deptId')
const deptName = getQueryString('deptName')

export class PermissionOne {
  constructor() {
    store.dispatch('GenerateRoutes').then(() => {
      addRoutes()
      if (accessToken && userId) {
        store.commit('SET_TOKEN', accessToken)
        store.commit('SET_USERDATA', {
          deptId,
          deptName,
          userId,
          userName
        })
      }
      render()
    })
  }
}
