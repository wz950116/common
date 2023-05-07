import Vue from 'vue'
import Vuex from 'vuex'
import getters from './getters'
import user from './modules/user'
import permission from './modules/permission'

import VuexPersistence from 'vuex-persist'

Vue.use(Vuex)

const vuexLocal = new VuexPersistence({
  // 保存的key
  key: 'cci-mobile-base-local',
  // 指定local还是session
  storage: window.localStorage,
  // 持久化部分模块
  modules: ['user', 'permission']
})

export default new Vuex.Store({
  state: {},
  mutations: {},
  getters,
  actions: {},
  modules: { user, permission },
  plugins: [vuexLocal.plugin]
})
