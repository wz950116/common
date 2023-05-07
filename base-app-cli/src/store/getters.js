const getters = {
  token: (state) => state.user.token,
  idaastoken: (state) => state.user.idaastoken,
  isRefresh: (state) => state.user.isRefresh,
  menu: (state) => state.permission.menu,
  userData: (state) => state.user.userData,
  orgInfo: (state) => state.user.orgInfo,
  authorityCode: state => state.user.authorityCode,
  authorityType: state => state.user.authorityType
}
export default getters
