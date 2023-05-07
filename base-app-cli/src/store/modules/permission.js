import asyncRouterMap from '@/router/static/static'

const state = {
  menu: []
}
const mutations = {
  SET_MENU: (state, menu) => {
    state.menu = menu
  }
}
const actions = {
  /**
 * @Author: zhoulf
 * @description:获取权限
 * @return {*}
 */
  GenerateRoutes({ commit }) {
    return new Promise((resolve) => {
      commit('SET_MENU', asyncRouterMap)
      resolve()
    })
  },
  /**
     * 清空路由菜单
     * @param commit
     * @constructor
     */
  RemoveRoutes({ commit }) {
    return new Promise(resolve => {
      commit('SET_MENU', [])
      resolve()
    })
  }
}

export default {
  state,
  mutations,
  actions
}
