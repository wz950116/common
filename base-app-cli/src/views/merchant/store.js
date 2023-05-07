import request from '@/utils/request.js'
const api = '/mqwb'

// 商铺信息管理列表(默认查询全部 0:已录入|1:待确认|2:已确认|3:已变更|4:已作废)
export function findStoreBaseListByPage(data) {
  return request({
    url: `${api}/api/storeBase/findListByPage`,
    method: 'post',
    data
  })
}
// 查询商铺
export function findStoreBaseById(params) {
  return request({
    url: `${api}/api/storeBase/findById`,
    method: 'get',
    params
  })
}
// 创建商铺
export function createStoreBase(data) {
  return request({
    url: `${api}/api/storeBase/create`,
    method: 'post',
    data
  })
}
// 修改商铺
export function updateStoreBase(data) {
  return request({
    url: `${api}/api/storeBase/update`,
    method: 'post',
    data
  })
}
// 根据区域查询商户
export function findListByRegion(data) {
  return request({
    url: `${api}/api/storeBase/findListByRegion`,
    method: 'post',
    data
  })
}
// 作废
export function cancelStoreBase(data) {
  return request({
    url: `${api}/api/storeBase/cancel`,
    method: 'post',
    data
  })
}
// 恢复
export function restoreStoreBase(data) {
  return request({
    url: `${api}/api/storeBase/restore`,
    method: 'post',
    data
  })
}
// 确认
export function confirmStoreBase(data) {
  return request({
    url: `${api}/api/storeBase/confirm`,
    method: 'post',
    data
  })
}
// 变更
export function changeStoreBase(data) {
  return request({
    url: `${api}/api/storeBase/change`,
    method: 'post',
    data
  })
}
// 申请确认
export function applyConfirmStoreBase(data) {
  return request({
    url: `${api}/api/storeBase/applyConfirm`,
    method: 'post',
    data
  })
}
