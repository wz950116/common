import Vue from 'vue'
export const state = Vue.observable({
  includes: []
})
export const getters = {
  getPageNames() {
    return state.includes
  }
}
export const mutations = {
  delPageName(name) {
    const index = state.includes.findIndex((item) => item === name)
    if (index > -1) {
      state.includes.splice(index, 1)
    }
  },
  addPageName(name) {
    if (!state.includes.includes(name)) {
      state.includes.push(name)
    }
  },
  clearPageName() {
    state.includes = []
  }
}
