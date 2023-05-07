/*
 * @Author: zhoulf
 * @FilePath: /jzygf-municipal-app/src/permission/permissionFactory.js
 * @Date: 2022-10-14 15:12:51
 * @LastEditors: zhoulf
 * @LastEditTime: 2023-03-20 17:41:24
 * @Description:
 */
import store from '@/store'
import { PermissionTC } from './permissionTc'
import { PermissionOne } from './permissionOne'
import { isTestMode } from '@/utils'
import { addRoutes } from '@/router/generatorRouters'
import render from '@/core/render'
const AuthType = {
  ONE: 'ONE', // 统一研发平台单点登陆
  TC: 'TC' // 三中心3.0用户体系使用者部门自己处理
}
/**
 * 创建权限模块实例
 * @param type
 * @returns {null}
 */
function initPermissionInstance(type) {
  console.log(type, isTestMode, 'xxxx')
  // 测试模式，直接获取本地的静态路由
  if (isTestMode) {
    store.dispatch('GenerateRoutes').then(() => {
      addRoutes()
      render()
    })
  } else {
    let instance = null
    switch (type) {
      case AuthType.ONE: {
        instance = new PermissionOne()
        break
      }
      case AuthType.TC: {
        instance = new PermissionTC()
        break
      }
    }

    return instance
  }
}

export { initPermissionInstance, AuthType }
