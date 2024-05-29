const state = {
  nickName: '',
  userPhone: '', // 18712345678
  h5Token: '',
  userInfo: {}, // 用户信息
  elderly: 1 // 模式 1是正常模式，2是老年模式
}
const mutations = {
  SET_ELDERLY: (state, elderly) => {
    state.elderly = elderly
  },
  SET_USER_PHONE(state, data) {
    state.nickName = data.nickName || ''
    state.userPhone = data.userPhone || ''
    state.h5Token = data.h5Token || ''
  }
}

const actions = {
  setUserPhone({ commit }, data) {
    commit('SET_USER_PHONE', data)
  }
}

export default {
  namespaced: true,
  state,
  actions,
  mutations
}
