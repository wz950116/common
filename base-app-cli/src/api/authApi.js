/*
 * @Author: zhoulf
 * @FilePath: /dg-maintenance-work-app/src/api/authApi.js
 * @Date: 2022-10-14 15:49:41
 * @LastEditors: zhoulf
 * @LastEditTime: 2022-10-17 16:12:50
 * @Description:
 */
import instance from '@/utils/request.js'

// 校验token是否有效
function checkToken(token) {
  return instance({
    method: 'get',
    url: `/oauth2/oauth/check_token`,
    opts: {
      params: { token }
    }
  })
}
// 获取用户信息
function getUserInfoByToken(token) {
  return instance({
    url: `/oauth2/user/getUserInfo`,
    params: {
      token
    }
  })
}
// 统一获取三中心数据
function loginByCode(data) {
  // 代理根据自己项目的后端自己处理
  return instance({
    method: 'post',
    url: `/jz-sz/api/tc/auth/v2/loginByCode`,
    data
  })
}
// 查询登录人部门组织结构表
function findByDeptId(params) {
  // 代理根据自己项目的后端自己处理
  return instance({
    method: 'get',
    url: `/jz-sz/api/deptDataAuthority/findByDeptId`,
    params
  })
}

// token 登录
function loginByAccessToken(data) {
  return instance({
    method: 'post',
    url: `/jz-sz/api/tc/auth/v2/loginByAccessToken`,
    data
  })
}
// 刷新获取新token以及用户信息
function refreshToken(data) {
  return instance({
    method: 'post',
    url: `/jz-sz/api/tc/auth/refreshToken`,
    data
  })
}
export {
  checkToken,
  refreshToken,
  loginByAccessToken,
  findByDeptId,
  loginByCode,
  getUserInfoByToken
}
