import gcoord from 'gcoord'

export const isTestMode = process.env.NODE_ENV === 'test'
export const isDevMode = process.env.NODE_ENV === 'development'
export const isProMode = process.env.NODE_ENV === 'production'

export function timeFormatter(time, pattern) {
  const _pattern = pattern || 'yyyy-MM-dd hh:mm:ss'
  const date = new Date(time)
  if (date.toString() === 'Invalid Date') {
    // console.error('日期转换失败')
    return ''
  }
  const dayFilter = ['日', '一', '二', '三', '四', '五', '六']
  const timeObj = {
    yyyy: date.getFullYear(),
    MM: `0${date.getMonth() + 1}`.slice(-2),
    M: date.getMonth() + 1,
    dd: `0${date.getDate()}`.slice(-2),
    d: date.getDate(),
    hh: `0${date.getHours()}`.slice(-2),
    h: date.getHours(),
    mm: `0${date.getMinutes()}`.slice(-2),
    m: date.getMinutes(),
    ss: `0${date.getSeconds()}`.slice(-2),
    s: date.getSeconds(),
    // 星期
    day: date.getDay(),
    dayStr: dayFilter[date.getDay()]
  }
  const timeStr = _pattern.replace(/(dayStr|day|yyyy|MM|M|dd|d|hh|h|mm|m|ss|s)+/g, function(match, p) {
    const value = timeObj[p]
    return value
  })
  return timeStr
}

export function getQueryString(name) {
  const reg = new RegExp('(^|&|\\?)' + name + '=([^&]*)(&|$)', 'i')
  const r = window.location.href.match(reg)
  if (r != null) {
    return decodeURI(r[2])
  }
  return null
}

export function deepClone(o, c) {
  const toString = Object.prototype.toString
  toString.call(o) === '[object Array]' ? c = c || [] : c = c || {}
  for (const i in o) {
    if (typeof o[i] === 'object' && o[i] !== null) {
      // 要考虑深复制问题了
      if (Array.isArray(o[i])) {
        // 这是数组
        c[i] = []
      } else {
        // 这是对象
        c[i] = {}
      }
      deepClone(o[i], c[i])
    } else {
      c[i] = o[i]
    }
  }
  return c
}

export function treeToList(tree, result = []) {
  tree.forEach((node) => {
    if (node.url) {
      result.push({
        url: node.url || null,
        path: node.url || null,
        name: node.name || null,
        meta: node.meta || null,
        icon: node.icon || null,
        id: node.id || null,
        ...node
      })
    }
    node.children && treeToList(node.children, result)
  })
  return result
}

// 不同坐标系经纬度转换 BD09 WGS84 AMap
export function transformPoint(target, type = 'WGS84', targetType = 'AMap') {
  return gcoord.transform(target, gcoord[type], gcoord[targetType])
}
