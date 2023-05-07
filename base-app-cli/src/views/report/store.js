import request from '@/utils/request.js'
const api = '/mqwb'

// 门前五包上报
export function createStoreCase(data) {
  return request({
    url: `${api}/api/storeCase/create`,
    method: 'post',
    data
  })
}
// 门前五包类型
export function getStoreManageTypeComboBox(params) {
  return request({
    url: `${api}/api/storeManageType/comboBox`,
    method: 'get',
    params
  })
}
// 查询五包类型关联
export function findByManagerTypeCode(params) {
  return request({
    url: `${api}/api/storeManageConfig/findByManagerTypeCode`,
    method: 'get',
    params
  })
}
// 根据部件-事件第三级编号查询立案条件
export function findByCategoryCode(params) {
  return request({
    url: `${api}/api/caseStandard/findByCategoryCode`,
    method: 'get',
    params
  })
}
// 根据商户名称当前经纬度查询商户
export function findListByStoreName(data) {
  return request({
    url: `${api}/api/storeBase/findListByStoreName`,
    method: 'post',
    data
  })
}
