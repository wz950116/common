import request from '@/utils/request.js'
const api = '/mqwb'

// 分页查询列表
export function findStoreSignManageListByPage(data) {
  return request({
    url: `${api}/api/storeSignManage/findListByPage`,
    method: 'post',
    data
  })
}
// 查询商铺
export function findStoreSignManageById(params) {
  return request({
    url: `${api}/api/storeSignManage/findById`,
    method: 'get',
    params
  })
}
// 新增
export function createStoreSignManage(data) {
  return request({
    url: `${api}/api/storeSignManage/create`,
    method: 'post',
    data
  })
}
// 修改
export function updateStoreSignManage(data) {
  return request({
    url: `${api}/api/storeSignManage/update`,
    method: 'post',
    data
  })
}
// 招牌类型下拉框
export function findStoreSignConfigComboBox(params) {
  return request({
    url: `${api}/api/storeSignConfig/comboBox`,
    method: 'get',
    params
  })
}
// 作废
export function cancelStoreSignManage(data) {
  return request({
    url: `${api}/api/storeSignManage/cancel`,
    method: 'post',
    data
  })
}
