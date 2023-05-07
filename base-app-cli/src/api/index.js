import request from '@/utils/request.js'
const api = '/mqwb'
const pre_url2 = '/gisApi/jzApi'

// 文件上传
export const fileUpload = (data) => {
  return request({
    url: `${api}/api/file/uploadFile`,
    method: 'post',
    data
  })
}
// 根据枚举类型查询枚举项
export const queryEnumByEnumType = (enumType) => {
  return request({
    method: 'get',
    url: `${api}/api/common/queryEnumByEnumType`,
    params: {
      enumType
    }
  })
}
// 根据枚举类型查询枚举项
export const queryCityCommunity = (params) => {
  return request({
    method: 'get',
    url: `${api}/api/common/queryCityCommunity`,
    params
  })
}
// 获取地图点位信息
export const queryDataByCoordinate = (data) => {
  return request({
    method: 'post',
    url: `${pre_url2}/queryDataByCoordinate`,
    data
  })
}
// POI查询
export const queryAdministrativeDivisionByPage = (data) => {
  return request({
    method: 'post',
    url: `${pre_url2}/queryAdministrativeDivisionByPage`,
    data
  })
}
// 根据条件查询图层列表
export const getQueryLayerList = (data) => {
  return request({
    url: `${pre_url2}/queryLayerList`,
    method: 'POST',
    data
  })
}
