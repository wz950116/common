import request from '@/utils/request.js'
const api = '/mqwb'

// 商户列表
export function findStores(data) {
  return request({
    url: `${api}/api/mapPreview/findStores`,
    method: 'post',
    data
  })
}
// 商户id查询案件详情列表
export function findById(params) {
  return request({
    url: `${api}/api/mapPreview/findById`,
    method: 'get',
    params
  })
}
// 部件树
export function getUnitInfoTree(params) {
  return request({
    url: `${api}/api/unitInfo/tree`,
    method: 'get',
    params
  })
}
// 部件点位信息
export function findUnits(smallCode) {
  return request({
    url: `${api}/api/unitInfo/findUnits`,
    method: 'post',
    data: { smallCode }
  })
}
// 部件编码查询部件信息
export function findByUnitCode(unitCode) {
  return request({
    url: `${api}/api/unitInfo/findByUnitCode`,
    method: 'get',
    params: { unitCode }
  })
}
