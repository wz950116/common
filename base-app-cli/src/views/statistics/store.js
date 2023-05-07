import request from '@/utils/request.js'
const api = '/mqwb'

// 商户_统计报表
export function statsStoreBaseListByPage(data) {
  return request({
    url: `${api}/api/storeBase/stats`,
    method: 'post',
    data
  })
}

// 商户信息_统计报表
export function caseStoreBaseListByPage(data) {
  return request({
    url: `${api}/api/storeBase/stats/case`,
    method: 'post',
    data
  })
}
