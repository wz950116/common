import { refreshToken, loginByCode, findByDeptId } from '@/api/authApi'
import { Toast } from 'vant'
function setMenuChildren(v) {
  return v.map((i) => {
    if (!i.children) {
      i.children = []
    } else {
      i.children = setMenuChildren(i.children)
    }
    return i
  })
}
/** userstore模块 */
const state = {
  token: window.$storage.get('token') || '', // 用户令牌
  userData: window.$storage.get('userData') || {}, // 用户信息
  orgInfo: null, // 登录角色
  isRefresh: false, // 是否刷新
  idaastoken: '', // 统一认证token
  authorityCode: '', // 认证code
  authorityType: '' // 认证type
}

const mutations = {
  SET_TOKEN: (state, token) => {
    state.token = token
    window.$storage.save('token', token)
  },
  SET_IS_REFRESH: (state) => {
    state.isRefresh = true
  },
  SET_USERDATA: (state, userData) => {
    state.userData = userData
    window.$storage.save('userData', userData)
  },
  SET_IDAASTOKEN: (state, token) => {
    state.idaastoken = token
  },
  SET_AUTHOR: (state, authorityCode, authorityType) => {
    state.authorityCode = authorityCode
    state.authorityType = authorityType
  }
}

const actions = {
  /**
   * 刷新token
   * @param commit
   * @param state
   * @constructor
   */

  // GetUserInfo修改 因为有些同学模块使用了sessionStorage，所以就加了
  GetUserInfo({ commit, dispatch }, params) {
    return new Promise((resolve, reject) => {
      loginByCode({ ...params })
        .then((res) => {
          if (res.code === 100) {
            Toast.fail(res.message)
            return false
          }
          const { loginUser = {}, accessToken = '' } = res.data
          const user = {
            currentSiteId: loginUser.project.projectId,
            currentSiteName: loginUser.project.projectName,
            deptId: loginUser.deptment.deptId,
            deptName: loginUser.deptment.deptName,
            fullPath: '',
            groupId: loginUser.user.groupId,
            groupName: '',
            groupNo: '',
            ownRoles: loginUser.tcRoleList,
            platformId: '',
            userGrade: loginUser.user.userGrade,
            userId: loginUser.user.userId,
            userName: loginUser.user.userName,
            userNo: loginUser.user.userNo
          }
          commit('SET_TOKEN', accessToken)
          // commit('SET_TOKEN_VALID')
          commit('SET_USERDATA', user)
          commit('SET_IS_REFRESH')
          // 查询登录人部门组织结构表
          dispatch('GetUserOrg', { deptId: loginUser.deptment.deptId })
          resolve(setMenuChildren(loginUser.projectFunctionList))
        })
        .catch((err) => reject(err))
    })
  },
  GetUserInfoByToken({ commit, dispatch }, data) {
    return new Promise((resolve, reject) => {
      refreshToken({ ...data })
        .then(({ data: { loginUser = {}, accessToken = '' } }) => {
          const user = {
            currentSiteId: loginUser.project.projectId,
            currentSiteName: loginUser.project.projectName,
            deptId: loginUser.deptment.deptId,
            deptName: loginUser.deptment.deptName,
            fullPath: '',
            groupId: loginUser.user.groupId,
            groupName: '',
            groupNo: '',
            ownRoles: loginUser.tcRoleList,
            platformId: '',
            userGrade: loginUser.user.userGrade,
            userId: loginUser.user.userId,
            userName: loginUser.user.userName,
            userNo: loginUser.user.userNo
          }

          commit('SET_TOKEN', accessToken)
          // commit('SET_TOKEN_VALID')
          commit('SET_USERDATA', user)
          commit('SET_IS_REFRESH')
          // 查询登录人部门组织结构表
          dispatch('GetUserOrg', { deptId: loginUser.deptment.deptId })
          resolve(setMenuChildren(loginUser.projectFunctionList))
        })
        .catch((err) => reject(err))
    })
  },
  /**
   * 退出登陆
   * @param commit
   * @param useLogoutApi
   * @constructor
   */
  Logout({ commit }) {
    return new Promise((resolve) => {
      commit('SET_TOKEN', '')
      commit('SET_USERDATA', {})
      resolve(process.env.VUE_APP_UNIFIED_PLATFORM_AUTH)
    })
  },
  GetUserOrg({ commit }, params) {
    findByDeptId(params).then(({ code, data }) => {
      if (code === 0) {
        if (data) {
          commit('SET_AUTHOR', data.authorityCode, data.authorityType)
        } else {
          commit('SET_AUTHOR', null, null)
        }
        // authorityType 类型  1:市监管,  2:镇街监管,  3:供气企业
        // authorityCode   null 市监管 镇街id 企业社会信用代码
      }
    })
  }
}

export default {
  state,
  mutations,
  actions
}
