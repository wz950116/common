var pi = 3.14159265358979324
var a = 6378245.0
var ee = 0.00669342162296594323
/* 判断是否在国内，不在国内则不做偏移 */
function outOfChina(lon, lat) {
  if ((lon < 72.004 || lon > 137.8347) && (lat < 0.8293 || lat > 55.8271)) {
    return true
  } else {
    return false
  }
}
function transformLat(x, y) {
  var ret = -100.0 + 2.0 * x + 3.0 * y + 0.2 * y * y + 0.1 * x * y + 0.2 * Math.sqrt(Math.abs(x))
  ret += (20.0 * Math.sin(6.0 * x * pi) + 20.0 * Math.sin(2.0 * x * pi)) * 2.0 / 3.0
  ret += (20.0 * Math.sin(y * pi) + 40.0 * Math.sin(y / 3.0 * pi)) * 2.0 / 3.0
  ret += (160.0 * Math.sin(y / 12.0 * pi) + 320 * Math.sin(y * pi / 30.0)) * 2.0 / 3.0
  return ret
}

function transformLon(x, y) {
  var ret = 300.0 + x + 2.0 * y + 0.1 * x * x + 0.1 * x * y + 0.1 * Math.sqrt(Math.abs(x))
  ret += (20.0 * Math.sin(6.0 * x * pi) + 20.0 * Math.sin(2.0 * x * pi)) * 2.0 / 3.0
  ret += (20.0 * Math.sin(x * pi) + 40.0 * Math.sin(x / 3.0 * pi)) * 2.0 / 3.0
  ret += (150.0 * Math.sin(x / 12.0 * pi) + 300.0 * Math.sin(x / 30.0 * pi)) * 2.0 / 3.0
  return ret
}

export function CGCS2000ToGcj02(lnglat) {
  const wgLat = lnglat.lat
  const wgLon = lnglat.lng
  var marsPoint = {}
  if (outOfChina(wgLon, wgLat)) {
    marsPoint.lat = wgLat
    marsPoint.lng = wgLon
    return marsPoint
  }
  var dLat = transformLat(wgLon - 105.0, wgLat - 35.0)
  var dLon = transformLon(wgLon - 105.0, wgLat - 35.0)
  var radLat = wgLat / 180.0 * pi
  var magic = Math.sin(radLat)
  magic = 1 - ee * magic * magic
  var sqrtMagic = Math.sqrt(magic)
  dLat = (dLat * 180.0) / ((a * (1 - ee)) / (magic * sqrtMagic) * pi)
  dLon = (dLon * 180.0) / (a / sqrtMagic * Math.cos(radLat) * pi)
  marsPoint.lat = wgLat + dLat
  marsPoint.lng = wgLon + dLon
  return marsPoint
}

export function Gcj02ToCGCS2000(lnglat) {
  const { lat: gcjLat, lng: gcjLon } = lnglat
  const d = delta(gcjLat, gcjLon)
  return {
    lat: gcjLat - d.lat,
    lng: gcjLon - d.lon
  }
}

function delta(lat, lon) {
  const a = 6378245.0 //  a: 卫星椭球坐标投影到平面地图坐标系的投影因子。
  const ee = 0.00669342162296594323 //  ee: 椭球的偏心率。
  let dLat = transformLat(lon - 105.0, lat - 35.0)
  let dLon = transformLon(lon - 105.0, lat - 35.0)
  const radLat = lat / 180.0 * pi
  let magic = Math.sin(radLat)
  magic = 1 - ee * magic * magic
  const sqrtMagic = Math.sqrt(magic)
  dLat = (dLat * 180.0) / ((a * (1 - ee)) / (magic * sqrtMagic) * pi)
  dLon = (dLon * 180.0) / (a / sqrtMagic * Math.cos(radLat) * pi)
  return {
    lat: dLat,
    lon: dLon
  }
}
