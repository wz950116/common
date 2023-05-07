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
