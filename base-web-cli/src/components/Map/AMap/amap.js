import AMap from 'AMap'
import AMapStyle, { MAP_STYLE } from './amap-config'
import gcoord from 'gcoord'
const TLayer = {
  base: 'http://t{0,1,2,3,4,5,6,7}.tianditu.gov.cn/DataServer?T=vec_w&tk=ef63801764261c156ba74a40612a717b&x=[x]&y=[y]&l=[z]',
  tag: 'http://t{0,1,2,3,4,5,6,7}.tianditu.gov.cn/DataServer?T=cva_w&tk=ef63801764261c156ba74a40612a717b&x=[x]&y=[y]&l=[z]'
}
export class MapContainer {
  constructor(options) {
    // 逆地理编码实例
    this.geocoder = new AMap.Geocoder()
    // 海量点实例集合
    this.massMarksMap = new Map()
    // 覆盖物集合实例集合
    this.overlayGroupMap = new Map()
    // 聚合覆盖物实例集合
    this.clusterMarkersMap = new Map()
    // 标记物实例集合
    this.markerLayer = new Map()
    // init
    this.initMap(options)
    // 配置项
    this.options = Object.assign({}, options)
    // 单个点位
    this.localtionMarker = null
    // 存放不同的信息窗口
    this.infoWindow = null
    // 热力图
    this.heatmap = null
    // 卫星图
    this.satelliteLayer = null
  }

  /**
   *初始化地图
   * @param {Object} options 参数配置与高德的相同
   * @memberof MapContainer
   */
  initMap(options) {
    const map = new AMap.Map(
      options.target,
      Object.assign({
        mapStyle: 'amap://styles/01516727b6666c5a6b4b0ef52e054936',
        center: [120.047356, 28.88899],
        zoom: 17,
        zooms: [3, 20],
        expandZoomRange: true,
        ...options
      })
    )
    if (options.TLayer) {
      map.setLayers([
        new AMap.TileLayer({
          // 天地图底图图块取图地址
          getTileUrl: TLayer.base,
          zIndex: 1
        }),
        new AMap.TileLayer({
          // 天地图底图图块取图地址
          getTileUrl: TLayer.tag,
          zIndex: 2
        })
      ])
    }
    this.map = map
  }

  /**
   * 删除指定图层
   * @param {any} name 图层名称
   */
  clearLayer(name = 'normal') {
    let layer = this.markerLayer.get(name)
    if (this.markerLayer.has(name)) {
      layer.clearOverlays()
      console.log(this.markerLayer)
    }
  }

  /**
   * 添加多个点
   * @param {any} name 图层名称
   * @param {Array} points 点位数组
   * @param {*} type
   */
  addPoints({ name = 'normal', points, toCenter = true, onclick, popup, showPopup = false }) {
    let layer = this.markerLayer.get(name)
    if (this.markerLayer.has(name)) {
      layer.clearOverlays()
    } else {
      this.markerLayer.set(name, new AMap.OverlayGroup())
      layer = this.markerLayer.get(name)
    }
    // 关闭打开的弹窗
    this.clearInfoWindow()
    // 遍历创建点实例
    const markers = []
    points.forEach((item, index) => {
      if (!/\d/.test(item.lat || item.latitude)) {
        return
      }
      const longitude = item.lon || item.lng || item.longitude
      const latitude = item.lat || item.latitude
      if (longitude && latitude) {
        const marker = new AMap.Marker({
          position: new AMap.LngLat(longitude, latitude),
          icon: MAP_STYLE[item.name || name]
        })
        marker.on('click', () => {
          onclick && onclick({ type: item.name || name, ...item })
          // 点击标记打开弹窗
          if (showPopup && !this.infoWindow) {
            this.openInfoWindow({
              target: popup || item.popup, // dom ref
              longitude,
              latitude,
              offset: item.popupOffset || [0, 0]
            })
            // 激活标记
            marker.setIcon(MAP_STYLE[(item.name || name) + 'Active'])
            // 打开弹窗回调
            item.popupopen && item.popupopen()
            // 关闭弹窗回调
            this.infoWindow.on('close', () => {
              marker.setIcon(MAP_STYLE[item.name || name])
              this.infoWindow = null
            })
          }
        })
        markers.push(marker)
      }
      if (index === 0 && toCenter) {
        this.setCenterPosition([longitude, latitude], this.map.getZoom())
      }
    })
    layer.addOverlays(markers)
    layer.setMap(this.map)
  }

  /**
   * 设置单个点位
   * @param {Number} {longitude} 经度
   * @param {Number} {latitude} 纬度
   * @param {Icon} {icon} 点位图标
   * @memberof MapContainer
   */
  setLocaltion({
    longitude,
    latitude,
    toCenter,
    icon = new AMap.Icon(AMapStyle.location),
    options
  }) {
    this.clearLocaltion()

    this.localtionMarker = new AMap.Marker({
      icon,
      position: new AMap.LngLat(longitude, latitude),
      ...options
    })
    this.localtionMarker.setMap(this.map)
    if (toCenter) {
      this.setCenterPosition([longitude, latitude], this.map.getZoom())
    }
  }

  // 删除单个点位
  clearLocaltion() {
    this.localtionMarker && this.localtionMarker.setMap(null)
    this.localtionMarker = null
  }

  /**
   * 添加聚合点位
   *
   * @param {Array} { data } 点位数据
   * @param {String} { type } 点位类型
   * @param {Object} { markerOpt } 点配置
   * @param {Function} { markerClickCallback } 坐标点点击回调
   * @param {Object} { options } 聚合配置
   * @memberof MapContainer
   */
  addMarkerClusterer({ data, name = 'normal', markerOpt, markerClickCallback, options, toCenter = true, showPopup, popup }) {
    const markers = data.map(item => {
      const longitude = item.lon || item.lng || item.longitude
      const latitude = item.lat || item.latitude
      const marker = new AMap.Marker({
        position: new AMap.LngLat(longitude, latitude),
        extData: item,
        icon: new AMap.Icon(AMapStyle.clusterMarker[item.name || name]),
        ...markerOpt
      })
      marker.on('click', () => {
        // 点击回调事件
        markerClickCallback && marker.on('click', markerClickCallback)
        // 点击标记打开弹窗
        if (showPopup && !this.infoWindow) {
          this.openInfoWindow({
            target: popup || item.popup, // dom ref
            longitude,
            latitude,
            offset: item.popupOffset || [0, 0]
          })
          // 打开弹窗回调
          item.popupopen && item.popupopen()
          // 关闭弹窗回调
          this.infoWindow.on('close', () => {
            marker.setIcon(MAP_STYLE[item.name || name])
            this.infoWindow = null
          })
        }
      })

      return marker
    })

    if (data.length && toCenter) {
      this.setCenterPosition([data[0].longitude || data[0].lng, data[0].latitude || data[0].lat], 12)
    }

    // clusterMarkersMap 分类管理聚合点数据
    let clusterMarkers = this.clusterMarkersMap.get(name)
    window.clusterMarkersMap = this.clusterMarkersMap

    if (clusterMarkers) {
      clusterMarkers.setMarkers(markers)
    } else {
      clusterMarkers = new AMap.MarkerClusterer(this.map, markers, {
        styles: AMapStyle.clusterStyle,
        gridSize: 80,
        maxZoom: 15,
        ...options
      })
      this.clusterMarkersMap.set(name, clusterMarkers)
    }
  }

  // 清除聚合点
  clearAllClusterMarker(name = 'normal') {
    for (var map of this.clusterMarkersMap) { // 遍历Map
      map[1].clearMarkers()
    }
    let marker = this.clusterMarkersMap.get(name)
    marker && marker.clearMarkers()
  }

  /**
 * 添加海量点
 * @param {String} {type} 图层类型，用于管理多类型图标切换的情况
 * @param {Array} {data} 点位数据
 * @param {Object} {options} 高德MassMarks 类配置
 * @param {Function} {clickCallback} 点位点击后的回调
 * @memberof MapContainer
 */
  addMassMarks({ type, data, options = {}, clickCallback }) {
    if (this.massMarksMap.has(type)) {
      const mass = this.massMarksMap.get(type)
      mass.setData(data)
    } else {
      const mass = new AMap.MassMarks(data, {
        ...options,
        style: [{
          url: 'https://a.amap.com/jsapi_demos/static/images/mass0.png',
          anchor: new AMap.Pixel(6, 6),
          size: new AMap.Size(11, 11)
        }, {
          url: 'https://a.amap.com/jsapi_demos/static/images/mass1.png',
          anchor: new AMap.Pixel(4, 4),
          size: new AMap.Size(7, 7)
        }, {
          url: 'https://a.amap.com/jsapi_demos/static/images/mass2.png',
          anchor: new AMap.Pixel(3, 3),
          size: new AMap.Size(5, 5)
        }]
      })
      clickCallback && mass.on('click', clickCallback)
      mass.setMap(this.map)
      this.massMarksMap.set(type, mass)
    }
  }

  /**
   * 切换海量点图层显示隐藏
   * @param {String} type 点位类型
   * @param {Boolean} show 显示隐藏
   */
  changeMassTypeShow(type, show) {
    if (this.massMarksMap.has(type)) {
      const mass = this.massMarksMap.get(type)
      show ? mass.show() : mass.hide()
    }
  }

  /**
   * 获取海量点数据
   * @param {String} type 海量点类型
   */
  getMassTypeData(type) {
    if (this.massMarksMap.has(type)) {
      const mass = this.massMarksMap.get(type)
      return mass.getData()
    } else {
      console.log('no has this type!!')
      return []
    }
  }

  // 清除海量点
  clearMassType(type) {
    if (this.massMarksMap.has(type)) {
      const mass = this.massMarksMap.get(type)
      mass.setMap(null)
      this.massMarksMap.set(type, null)
    } else {
      console.log('no has this type!!')
    }
  }

  /**
   * 重新渲染海量点
   * @param {String} {type} 图层类型，用于管理多类型图标切换的情况
   * @memberof MapContainer
   */
  renderMassMarks(type) {
    if (this.massMarksMap.has(type)) {
      const mass = this.massMarksMap.get(type)
      mass.setStyle(AMapStyle[type])
    }
  }

  /**
   *打开信息弹窗
   * @param {String/HTMLElement} { target } // 显示内容，可以是HTML要素字符串或者HTMLElement对象
   * @param {*} { longitude } // 经度
   * @param {*} { latitude } // 纬度
   * @param {Array} { offset } // 信息窗体显示位置偏移量。默认基准点为信息窗体的底部中心（若设置了anchor，则以anchor值为基准点）。
   * @param {Function} { closeCallback } // 关闭弹窗的回调
   * @memberof MapContainer
   */
  openInfoWindow({ target, longitude, latitude, offset, closeWhenClickMap = false, closeCallback = (() => { }) }) {
    const position = new AMap.LngLat(longitude, latitude)
    this.infoWindow = new AMap.InfoWindow({
      isCustom: true, // 使用自定义窗体
      content: target,
      position,
      autoMove: true,
      closeWhenClickMap,
      offset: new AMap.Pixel(offset[0], offset[1])
    })
    // 关闭回调
    closeCallback && this.infoWindow.on('close', closeCallback)
    this.infoWindow.open(this.map, position)
  }

  /**
   * 清除信息窗口
   */
  clearInfoWindow() {
    if (this.infoWindow) {
      this.infoWindow.close()
      this.infoWindow = null
    }
  }

  // 移动地图到指定位置
  setCenterPosition(lnglat, zoom = this.map.getZoom()) {
    this.map.setZoomAndCenter(zoom, lnglat)
  }

  // 构造卫星图
  addSatellite() {
    this.satelliteLayer = new AMap.TileLayer.Satellite()
    this.map.add([this.satelliteLayer])
  }

  // 删除卫星图
  clearSatellite() {
    this.satelliteLayer && this.map.remove(this.satelliteLayer)
    this.satelliteLayer = null
  }

  /**
   * 添加热力图
   * @param {Array} data 数据
   * @param {Number} radius 点半径
   * @param {Array} opacity 透明度数组
   */
  addHeatMap(data, radius, opacity) {
    if (!this.heatmap) {
      this.heatmap = new AMap.Heatmap(this.map, {
        radius: radius || 25, // 给定半径
        opacity: opacity || [0, 0.8]
      })
    }
    this.heatmap.setDataSet({
      data: data
      // max: 100
    })
  }

  // 删除热力图
  clearHeatMap() {
    this.heatmap && this.map.remove(this.heatmap)
    this.heatmap = null
  }

  /**
   * 生成轨迹并回放轨迹
   * @param {Array} pathData 轨迹数据
   */
  addTrackReshow({ name = 'track', path = [], moveEndCallback, speedNum }) {
    // 清除上次移动点位，上次轨迹
    this.movePoint && this.movePoint.stopMove()
    this.movePoint && this.movePoint.setMap(null)
    this.movePoint = null
    this.overlayGroupMap.get('track') && this.overlayGroupMap.get('track').setMap(null)
    this.overlayGroupMap.set('track', null)

    // 轨迹长度小于2不处理
    if (path.length < 2) {
      return
    }

    // 生成路径线
    const movePolyline = new AMap.Polyline({
      path,
      strokeColor: 'rgba(0,197,148,1)',
      strokeOpacity: 1,
      strokeWeight: 4,
      strokeStyle: 'solid',
      lineJoin: 'round',
      lineCap: 'square',
      zIndex: 50
    })

    // 实例化涂层组
    const OverlayGroup = new AMap.OverlayGroup([movePolyline])
    // 生成移动点位
    this.movePoint = new AMap.Marker({
      map: this.map,
      position: path[0],
      icon: 'https://webapi.amap.com/images/car.png',
      offset: new AMap.Pixel(-26, -13),
      autoRotation: true,
      angle: -90
    })
    this.movePoint.on('movealong', () => { moveEndCallback && moveEndCallback() })
    speedNum = speedNum || 1
    this.movePoint.moveAlong(path, 200 * speedNum)
    OverlayGroup.addOverlays([this.movePoint])

    this.overlayGroupMap.set(name, OverlayGroup)
    OverlayGroup.setMap(this.map)
    this.map.setFitView(movePolyline)
    return OverlayGroup
  }

  /**
   *  鼠标工具
   * @param {String} type 类型
   * @param {Object} styleOption 样式配置
   * @param {Boolean} clearPoly 是否保留覆盖物实例
   * @param {function} callback 回调函数
   */
  mouseToolDraw(type, styleOption = {}, clearPoly, callback) {
    this.mouseTool && this.mouseTool.close(true)
    const hasType = ['polyline', 'polygon', 'circle', 'rectangle'].includes(type)
    if (!hasType) { throw new Error("type is required and in ['polyline', 'polygon', 'circle']") }
    this.mouseTool = new AMap.MouseTool(this.map)

    this.mouseTool.on('draw', function({ obj }) {
      // 是否保留覆盖物实例
      this.mouseTool && this.mouseTool.close(!!clearPoly)
      // 把画出的实例作为参数
      callback && callback(obj)
    }.bind(this))
    this.mouseTool[type]({

      strokeColor: '#4169E1',
      strokeOpacity: 1,
      strokeWeight: 4,
      // 折线样式还支持 'dashed'
      strokeStyle: 'dashed',
      // strokeStyle是dashed时有效
      strokeDasharray: [10, 5],
      lineJoin: 'round',
      lineCap: 'round',
      zIndex: 50,
      ...styleOption
    })
  }

  /**
   * 清除鼠标画的poly
   */
  clearMouseToolDraw() {
    this.mouseTool && this.mouseTool.close(true)
  }

  /**
   * 生成折线编辑器
   * @param {String} { type } 类型
   * @param {Array} { path } 折线或多边形数据
   * @param {Object} { styleOption } 折线或多边形样式
   * @param {function} { addNodeCallback } 增加节点回调
   * @param {function} { adjustCallback } 移动节点回调
   * @param {function} { endCallback } 结束编辑回调
   */
  newPolyEditor({
    type,
    path,
    styleOption = {},
    addNodeCallback,
    adjustCallback,
    endCallback,
    drawCallback
  }) {
    // 结束编辑事件
    this.polyEditor && this.polyEditor.close()
    this.poly && this.poly.setMap(null)
    this.poly = null

    const fn = (poly) => {
      this.poly = poly
      this.poly.setMap(this.map)

      // 缩放地图到合适的视野级别
      this.map.setFitView([this.poly])
      // 初始化编辑器
      this.polyEditor = new AMap.PolyEditor(this.map, this.poly)

      //  添加节点事件
      this.polyEditor.on('addnode', function(event) {
        console.log('addnode')

        addNodeCallback && addNodeCallback(event)
      })
      // 节点改变事件
      this.polyEditor.on('adjust', function(event) {
        console.log('adjust')
        adjustCallback && adjustCallback(event)
      })
      // 结束编辑事件
      this.polyEditor.on('end', function(event) {
        console.log('end')
        endCallback && endCallback(event)
        // event.target 即为编辑后的折线对象
      })

      this.polyEditor.open()
      drawCallback && drawCallback(this.polyEditor)
    }

    if (path) {
      let poly = null
      if (type === 'polyline') {
        poly = new AMap.Polyline({
          path,
          strokeColor: '#4169E1',
          strokeOpacity: 1,
          strokeWeight: 4,
          // 折线样式还支持 'dashed'
          strokeStyle: 'dashed',
          // strokeStyle是dashed时有效
          strokeDasharray: [10, 5],
          lineJoin: 'round',
          lineCap: 'round',
          zIndex: 50,
          ...styleOption
        })
      } else if (type === 'polygon') {
        poly = new AMap.Polygon({
          path,
          strokeColor: '#4169E1',
          fillColor: '#4169E1',
          fillOpacity: 0.2,
          strokeOpacity: 1,
          strokeWeight: 4,
          // 折线样式还支持 'dashed'
          strokeStyle: 'dashed',
          // strokeStyle是dashed时有效
          strokeDasharray: [10, 5],
          lineJoin: 'round',
          lineCap: 'round',
          zIndex: 50,
          ...styleOption
        })
      }
      fn(poly)
    } else {
      this.mouseToolDraw(type, styleOption, false, fn)
    }
  }
}

/**
   * 逆地理编码
   * @param {Array} lnglat
   */
export function getAddressByLnglat(lnglat, callback, options = { city: '全国', radius: 500 }) {
  const geocoder = new AMap.Geocoder({
    ...options
  })
  geocoder.getAddress(lnglat, function(status, result) {
    if (status === 'complete' && result.regeocode) {
      callback && callback(result.regeocode.formattedAddress)
    } else {
      console.log('根据经纬度查询地址失败')
    }
  })
}

/**
 * 搜索兴趣点
 * @param {String} val 关键词
 * @param {Function} cb 结果标记物点击回调事件
 * @param {String} city 查询城市
 */
export function searchPosAndMarker(val, cb, city = '杭州市') {
  const placeSearch = new AMap.PlaceSearch({
    city
  })
  placeSearch.search(val, (status, result) => {
    const pois = result.poiList && result.poiList.pois
    cb(pois)
  })
}

/**
 * @param {Array} target 当前坐标
 * @param {String} type 当前坐标系
 * @param {String} targetType 目标坐标系
 */
export function transformPoint(target, type = 'WGS84', targetType = 'AMap') {
  return gcoord.transform(target, gcoord[type], gcoord[targetType])
}

MapContainer.getAddressByLnglat = getAddressByLnglat

export default MapContainer
