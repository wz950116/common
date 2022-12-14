import axios from 'axios'
import qs from 'qs'
import store from '@/store'
import { getToken } from '@/utils/auth'
import { isJSON } from '@/utils'

axios.defaults.transformRequest = (data, headers) => {
  if (store.getters.token) {
    headers.accesstoken = getToken() // 让每个请求携带自定义token 请根据实际情况自行修改
  }
  if (data instanceof FormData) {
    return data
  }
  if (headers['Content-Type'] === 'application/x-www-form-urlencoded' && data && Object.prototype.toString.call(data) === '[object Object]') {
    return qs.stringify(data)
  }
  return JSON.stringify(data)
}

axios.defaults.headers.post['Content-Type'] = 'application/json'

const newAxios = axios.create({
  timeout: 15000
})

newAxios.interceptors.request.use(config => {
  // if (config.params && config.params.toString() === '[object Object]') { config.params.__timeStamp = new Date().getTime() }
  return config
}, err => {
  return Promise.reject(err)
})

newAxios.interceptors.response.use(response => {
  const accesstoken = response.headers.accesstoken
  const res = isJSON(response.data) ? JSON.parse(response.data) : response.data
  if (accesstoken && res.data) {
    res.data.accesstoken = accesstoken
  }
  // 因为具有外部系统，无法保证所有接口都是具有 success 属性和 message 属性
  /* if (!res.success) {
    const message = res.message || res.msg
    Message({
      type: 'error',
      showClose: true,
      message: message
    })
    return Promise.reject(res)
  } */
  if (Object.prototype.toString.call(res) === '[object Object]') {
    return res
  } else {
    // 针对返回 res 是二进制数据流
    return response
  }
}, err => {
  return Promise.reject(err)
})

export function request(_param) {
  const {
    method = 'get',
    // `responseType` 表示服务器响应的数据类型，可以是 'arraybuffer', 'blob', 'document', 'json', 'text', 'stream'
    responseType = 'json', // 默认的
    headers = {},
    url = '',
    params,
    data,
    ...otherData
  } = _param

  if (!url) {
    return new Promise((resolve, reject) => {
      reject(new Error('url is null'))
    })
  }
  const _method = method.toLowerCase()

  if (_method === 'get') {
    return newAxios({
      responseType,
      url,
      headers,
      method,
      params: params || data || otherData
    })
  }

  if (_method === 'post' || _method === 'delete' || _method === 'put') {
    if (!Object.prototype.hasOwnProperty.call(headers, 'Content-Type')) {
      headers['Content-Type'] = 'application/x-www-form-urlencoded'
    }
    if (params && data) {
      return newAxios({
        responseType,
        url,
        headers,
        method,
        params,
        data
      })
    } else {
      const { start, limit, ...resetData } = otherData
      return newAxios({
        responseType,
        url,
        headers,
        method,
        params: params || { start, limit },
        data: data || resetData
      })
    }
  }
}

export default newAxios
