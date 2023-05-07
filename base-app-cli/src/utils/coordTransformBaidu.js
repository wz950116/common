import L from 'leaflet'
import 'proj4'
import 'proj4leaflet'
export const baiduCRS = new L.Proj.CRS('EPSG:900913', '+proj=merc +a=6378206 +b=6356584.314245179 +lat_ts=0.0 +lon_0=0.0 +x_0=0 +y_0=0 +k=1.0 +units=m +nadgrids=@null +wktext  +no_defs', {
  resolutions: (function() {
    var level = 21
    var res = []
    res[0] = Math.pow(2, 18)
    for (var i = 1; i < level; i++) {
      res[i] = Math.pow(2, (18 - i))
    }
    return res
  }()),
  origin: [0, 0],
  bounds: L.bounds([20037508.342789244, 0], [0, 20037508.342789244])
})
L.CoordTransform = function() {
  // bd09转wgs84
  this.bd09_To_wgs84 = function(lng, lat) {
    var gcj02 = this.bd09_To_gcj02(lng, lat)
    var wgs84 = this.gcj02_To_wgs84(gcj02.lng, gcj02.lat)
    return wgs84
  }
  // wgs84转bd09
  this.wgs84_To_bd09 = function(lng, lat) {
    var gcj02 = this.wgs84_To_gcj02(lng, lat)
    var bd09 = this.gcj02_To_bd09(gcj02.lng, gcj02.lat)
    return bd09
  }
  // wgs84转gcj02
  this.wgs84_To_gcj02 = function(lng, lat) {
    var dLat = transformLat(lng - 105.0, lat - 35.0)
    var dLng = transformLng(lng - 105.0, lat - 35.0)
    var radLat = lat / 180.0 * pi
    var magic = Math.sin(radLat)
    magic = 1 - ee * magic * magic
    var sqrtMagic = Math.sqrt(magic)
    dLat = (dLat * 180.0) / ((a * (1 - ee)) / (magic * sqrtMagic) * pi)
    dLng = (dLng * 180.0) / (a / sqrtMagic * Math.cos(radLat) * pi)
    var mgLat = lat + dLat
    var mgLng = lng + dLng
    var newCoord = {
      lng: mgLng,
      lat: mgLat
    }
    return newCoord
  }
  // gcj02转wgs84
  this.gcj02_To_wgs84 = function(lng, lat) {
    var coord = transform(lng, lat)
    var lontitude = lng * 2 - coord.lng
    var latitude = lat * 2 - coord.lat
    var newCoord = {
      lng: lontitude,
      lat: latitude
    }
    return newCoord
  }
  // gcj02转bd09
  this.gcj02_To_bd09 = function(lng, lat) {
    var z = Math.sqrt(lng * lng + lat * lat) + 0.00002 * Math.sin(lat * x_pi)
    var theta = Math.atan2(lat, lng) + 0.000003 * Math.cos(lng * x_pi)
    var bd_lng = z * Math.cos(theta) + 0.0065
    var bd_lat = z * Math.sin(theta) + 0.006
    var newCoord = {
      lng: bd_lng,
      lat: bd_lat
    }
    return newCoord
  }
  // bg09转gcj02
  this.bd09_To_gcj02 = function(lng, lat) {
    var x = lng - 0.0065
    var y = lat - 0.006
    var z = Math.sqrt(x * x + y * y) - 0.00002 * Math.sin(y * x_pi)
    var theta = Math.atan2(y, x) - 0.000003 * Math.cos(x * x_pi)
    var lontitude = z * Math.cos(theta)
    var latitude = z * Math.sin(theta)
    var newCoord = {
      lng: lontitude,
      lat: latitude
    }
    return newCoord
  }
  var pi = 3.1415926535897932384626
  var a = 6378245.0
  var ee = 0.00669342162296594323
  var x_pi = pi * 3000.0 / 180.0
  function transform(lng, lat) {
    var dLat = transformLat(lng - 105.0, lat - 35.0)
    var dLng = transformLng(lng - 105.0, lat - 35.0)
    var radLat = lat / 180.0 * pi
    var magic = Math.sin(radLat)
    magic = 1 - ee * magic * magic
    var sqrtMagic = Math.sqrt(magic)
    dLat = (dLat * 180.0) / ((a * (1 - ee)) / (magic * sqrtMagic) * pi)
    dLng = (dLng * 180.0) / (a / sqrtMagic * Math.cos(radLat) * pi)
    var mgLat = lat + dLat
    var mgLng = lng + dLng
    var newCoord = {
      lng: mgLng,
      lat: mgLat
    }
    return newCoord
  }
  function transformLat(x, y) {
    var ret = -100.0 + 2.0 * x + 3.0 * y + 0.2 * y * y + 0.1 * x * y + 0.2 * Math.sqrt(Math.abs(x))
    ret += (20.0 * Math.sin(6.0 * x * pi) + 20.0 * Math.sin(2.0 * x * pi)) * 2.0 / 3.0
    ret += (20.0 * Math.sin(y * pi) + 40.0 * Math.sin(y / 3.0 * pi)) * 2.0 / 3.0
    ret += (160.0 * Math.sin(y / 12.0 * pi) + 320 * Math.sin(y * pi / 30.0)) * 2.0 / 3.0
    return ret
  }
  function transformLng(x, y) {
    var ret = 300.0 + x + 2.0 * y + 0.1 * x * x + 0.1 * x * y + 0.1 * Math.sqrt(Math.abs(x))
    ret += (20.0 * Math.sin(6.0 * x * pi) + 20.0 * Math.sin(2.0 * x * pi)) * 2.0 / 3.0
    ret += (20.0 * Math.sin(x * pi) + 40.0 * Math.sin(x / 3.0 * pi)) * 2.0 / 3.0
    ret += (150.0 * Math.sin(x / 12.0 * pi) + 300.0 * Math.sin(x / 30.0 * pi)) * 2.0 / 3.0
    return ret
  }
}
export function coordTransform() {
  return new L.CoordTransform()
}
export const tileLayerInfo = {
  subdomains: '0123456789',
  minZoom: 12,
  maxZoom: 19,
  maxNativeZoom: 19,
  coordType: 'bd09',
  tms: true
}
