import request from '@/utils/request.js'

export function _printPreview(id) {
  return request({
    url: `/enforce/printing/print/${id}`,
    method: 'get',
    responseType: 'blob',
    timeout: 0
  })
}
// 现场检查（勘查）笔录打印预览
export function _printNow() {
  return request({
    url: `/enforce/trial-link/create_document_printing`,
    method: 'post',
    responseType: 'blob',
  })
}
