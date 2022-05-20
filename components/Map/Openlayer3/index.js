// OpenLayers 3(https://openlayers.org/en/latest/apidoc/module-ol_layer_Heatmap-Heatmap.html)
import ol from 'ol'
import CryptoJS from 'crypto-js'

// 和普通base64加密不一样
function base64UrlEncode(str) {
  let encodedSource = CryptoJS.enc.Base64.stringify(str)
  const reg = new RegExp('/', 'g')
  encodedSource = encodedSource.replace(/=+$/, '').replace(/\+/g, '-').replace(reg, '_')
  return encodedSource
}

export class MapContainer {
  constructor(options) {
    this.options = Object.assign({}, options)
    this.graphicSelect = this.options.graphicSelect
    this.waterIntakeLayer = null
    this.map = null
    this.initMap()
  }

  // 初始化地图
  initMap() {
    const header = JSON.stringify({
      alg: 'HS256',
      typ: 'JWT'
    })

    const accessKey = 'BCDSGA_9b874ac9cd22fd02e1dcbeeb73461536' // 修改自己申请的accessKey
    const secretKey = 'BCDSGS_bb8d002189c532848e391bfa99836a57' // 修改自己申请的secretKey

    // ak、sk和生成token建议在后端，避免前端调用的时候泄露
    const payload = JSON.stringify({
      key: accessKey,
      exp: new Date().setHours(new Date().getHours() + 1)
    })

    const beforeSign = base64UrlEncode(CryptoJS.enc.Utf8.parse(header)) + '.' + base64UrlEncode(CryptoJS.enc.Utf8.parse(payload))
    let signature = CryptoJS.HmacSHA256(beforeSign, secretKey)
    signature = base64UrlEncode(signature)
    const finalSign = beforeSign + '.' + signature

    const url1 = 'http://172.18.101.214:9111/emap/default/oss' // atg.biz.gettile_lab 电子地图标注服务调用地址
    const url2 = 'http://172.18.101.214:9111/emap_lab/default/oss' // atg.biz.gettile  电子地图服务调用地址

    const baseUrl1 = url1 + '?jwt=' + finalSign + '&x-bg-auth-type=jwt_auth' // 网关地址
    const baseUrl2 = url2 + '?jwt=' + finalSign + '&x-bg-auth-type=jwt_auth' // 网关地址

    const emap = this.addWMSTLayer(baseUrl1, 'emap')
    const emapLab = this.addWMSTLayer(baseUrl2, 'emap_lab')

    this.map = new ol.Map({
      layers: [emap, emapLab], // 初始加入图层,emap电子地图,imgmap影像地图，默认影像地图不可见
      target: this.options.target, // 目标组件
      logo: false,
      view: new ol.View({
        projection: 'EPSG:4326', // 坐标系
        maxZoom: 20, // 最大层级控制
        center: [120.25664, 29.153607], // 初始中心点坐标
        zoom: 8
        // 初始层级
      })
    })
    this.singleClick()
    this.pointerMove()
  }

  // 删除点位
  clearLayer() {
    if (this.waterIntakeLayer) {
      this.features.forEach(item => {
        this.waterIntakeLayer.getSource().removeFeature(item)
      })
      this.waterIntakeLayer = null
    }
  }

  // 添加WMST图层
  addWMSTLayer(url, layer) {
    const projection = ol.proj.get('EPSG:4326')
    const projectionExtent = projection.getExtent()
    const size = ol.extent.getWidth(projectionExtent) / 256
    const resolutions = new Array(20)
    const matrixIds = new Array(20)
    for (let z = 0; z < 20; ++z) {
      // generate resolutions and matrixIds arrays for this WMTS
      resolutions[z] = size / Math.pow(2, z)
      matrixIds[z] = z
    }
    return new ol.layer.Tile({
      opacity: 1,
      source: new ol.source.WMTS({
        url,
        layer,
        matrixSet: 'EPSG:4326',
        format: 'image/png',
        projection: projection,
        tileGrid: new ol.tilegrid.WMTS({
          origin: ol.extent.getTopLeft(projectionExtent),
          resolutions: resolutions,
          matrixIds: matrixIds
        }),
        style: 'default',
        wrapX: true
      })
    })
  }

  // 单击事件
  singleClick(latlng) {
    this.map.on('singleclick', (e) => {
      // 判断是否点击在点上
      const feature = this.map.forEachFeatureAtPixel(
        e.pixel,
        (feature) => feature
      )
      if (feature) {
        const params = feature.getProperties()
        this.graphicSelect && this.graphicSelect(e, { ...latlng, ...params })
        this.addOverlay()
        // 设置弹窗位置
        if (this.popup) {
          const coordinates = feature.getGeometry().getCoordinates()
          this.popup.setPosition(coordinates)
        } else {
          this.popup.setPosition(undefined)
        }
      }
    })
  }

  // 鼠标移到到点位上的光标样式
  pointerMove() {
    this.map.on('pointermove', (e) => {
      if (this.map.hasFeatureAtPixel(e.pixel)) {
        this.map.getViewport().style.cursor = 'pointer'
      } else {
        this.map.getViewport().style.cursor = 'inherit'
      }
    })
  }

  // 弹框内容
  addOverlay() {
    // 创建Overlay
    this.popup = new ol.Overlay({
      element: this.options.element,
      positioning: 'bottom-left',
      stopEvent: false,
      offset: [0, -20],
      autoPan: true, // 定义弹出窗口在边缘点击时候可能不完整 设置自动平移效果
      autoPanAnimation: {
        duration: 250 // 自动平移效果的动画时间 9毫秒
      }
    })
    this.map.addOverlay(this.popup)
  }

  // 添加标记物
  addMarker(points = [], imgSrc, options = {}) {
    // 显示图标
    const pumpingStation = new ol.style.Style({ /* icon样式 */
      image: new ol.style.Icon(({
        opacity: 0.95,
        src: imgSrc
      }))
    })
    // 创建容器
    if (!this.waterIntakeLayer) {
      this.waterIntakeLayer = new ol.layer.Vector({
        source: new ol.source.Vector(),
        name: '图标'
      })
    }
    // 取坐标值
    this.features = []
    points.forEach(item => {
      const latlng = [item.longitude || item.lon, item.latitude || item.lat]
      const featurexx = new ol.Feature({
        geometry: new ol.geom.Point(latlng)
      })
      // 添加点的时候赋值属性
      featurexx.setProperties({
        ...item,
        ...options
      })
      // 添加图标图案
      featurexx.setStyle(pumpingStation)
      this.features.push(featurexx)
      // 点击事件
      this.singleClick(latlng)
    })
    // 将图标特性添加进容器中
    this.waterIntakeLayer.getSource().addFeatures(this.features)
    // 添加到地图显示
    this.map.addLayer(this.waterIntakeLayer)

    return this.features
  }

  // 添加多边形 参数：点坐标、填充颜色、边框颜色
  addPolygon(points, fillColor, strokeColor) {
    // 创建一个多变形
    const Polygon = new ol.Feature({
      geometry: new ol.geom.Polygon([points])
    })
    // 设置区样式信息
    Polygon.setStyle(new ol.style.Style({
      // 填充色
      fill: new ol.style.Fill({
        color: fillColor || 'rgba(255, 255, 255, 0.9)'
      }),
      // 边线颜色
      stroke: new ol.style.Stroke({
        color: strokeColor || '#000000',
        width: 2
      })
    }))

    // 实例化一个矢量图层Vector作为绘制层
    const source = new ol.source.Vector({
      features: [Polygon]
    })
    // 创建一个图层
    const vector = new ol.layer.Vector({
      source: source
    })
    // 将绘制层添加到地图容器中
    this.map.addLayer(vector)
  }

  // 添加热力图 参数：geojson数据地址
  addHeatmap(url) {
    const blur = 10
    const radius = 15
    // 创建一个Heatmap图层
    const vector = new ol.layer.Heatmap({
      // 矢量数据源（读取本地的KML数据）
      source: new ol.source.Vector({
        url,
        format: new ol.format.GeoJSON()
      }),
      // 热点半径
      radius: parseInt(radius, 10),
      // 模糊尺寸
      blur: parseInt(blur, 10)
    })
    // 为矢量数据源添加addfeature事件监听
    vector.getSource().on('addfeature', function(event) {
      // 示例数据2012_Earthquakes_Mag5.kml，可从其地标名称提取地震信息
      // 要素的名称属性
      const name = event.feature.get('name')
      // 得到要素的地震震级属性（magnitude）
      const magnitude = parseFloat(name.substr(2))
      // 设置要素的weight属性
      event.feature.set('weight', magnitude - 5)
    })

    this.map.addLayer(vector)
  }

  // 绘制轨迹 参数：轨迹坐标集合、速度、图标
  drawTrack(coordinate, speed = 10, imgSrc) {
    const stops = coordinate.map(item => {
      const currLng = parseFloat(item[0])
      const currLat = parseFloat(item[1])
      return ol.proj.fromLonLat([currLng, currLat])
    })
    // 动画
    const map = this.map
    let animating = false
    let now

    const stopMakers = []

    for (let i = 0; i < 4; i++) {
      const s = new ol.Feature({
        type: 'stop',
        geometry: new ol.geom.Point(stops[i])
      })
      stopMakers.push(s)
    }

    // 将离散点构建成一条折线
    const route = new ol.geom.LineString(coordinate)
    // 获取直线的坐标
    const routeCoords = route.getCoordinates()
    const routeLength = routeCoords.length
    const geoMarker = new ol.Feature({
      type: 'geoMarker',
      geometry: new ol.geom.Point(routeCoords[0])
    })
    const styles = {
      route: new ol.style.Style({
        stroke: new ol.style.Stroke({
          width: 6,
          color: '#F2C841'
        }),
        fill: new ol.style.Fill({
          color: '#F6E3A3'
        })
      }),
      geoMarker: new ol.style.Style({
        image: new ol.style.Icon({
          src: imgSrc,
          rotateWithView: false,
          rotation: -Math.atan2(routeCoords[0][1] - routeCoords[1][1], routeCoords[0][0] - routeCoords[1][0]),
          scale: 0.75
        })
      }),
      geoMarkerHide: new ol.style.Style({
        image: new ol.style.Icon({
          src: imgSrc,
          rotateWithView: false,
          rotation: -Math.atan2(routeCoords[0][1] - routeCoords[1][1], routeCoords[0][0] - routeCoords[1][0]),
          scale: 0.75,
          opacity: 0
        })
      })
    }

    const routeFeature = new ol.Feature({
      type: 'route',
      geometry: route
    })

    // 创建容器
    const vectorLayer = new ol.layer.Vector({
      id: 'carLayer',
      source: new ol.source.Vector({
        features: [routeFeature, geoMarker, stopMakers[0], stopMakers[1], stopMakers[2], stopMakers[3]]
      }),
      style: function(feature) {
        return styles[feature.get('type')]
      }
    })
    this.map.addLayer(vectorLayer) // 将绘制层添加到地图容器中

    function moveFeature(event) {
      const vectorContext = event.vectorContext
      const frameState = event.frameState

      if (animating) {
        const elapsedTime = frameState.time - now // elapsedTime 已过时间
        const index = Math.round(speed * elapsedTime / 1000) // 已经走了多少个点

        if (index >= routeLength) {
          stopAnimation(true)
          return
        }
        if (index < 14) {
          flashFeature(0)
        }
        let dx, dy, rotation, carStyle
        if (routeCoords[index] && routeCoords[index + 1]) {
          dx = routeCoords[index][0] - routeCoords[index + 1][0]
          dy = routeCoords[index][1] - routeCoords[index + 1][1]
          rotation = Math.atan2(dy, dx)
          carStyle = new ol.style.Style({
            image: new ol.style.Icon({
              src: imgSrc,
              rotateWithView: false,
              rotation: -rotation
            })
          })
          const currentPoint = new ol.geom.Point(routeCoords[index])
          const feature = new ol.Feature(currentPoint)
          vectorContext.drawFeature(feature, carStyle)
        }
      }
      // 继续动画效果
      map.render()
    }

    const colors = ['red', 'green']
    let colorIndex = 0
    function flashFeature(index) {
      let color
      colorIndex++
      colorIndex = colorIndex % 30

      if (colorIndex < 15) {
        color = colors[0]
      } else {
        color = colors[1]
      }
      stopMakers[index].setStyle(new ol.style.Style({
        image: new ol.style.Circle({
          radius: 10,
          snapToPixel: false,
          fill: new ol.style.Fill({
            color: color
          }),
          stroke: new ol.style.Stroke({
            color: 'white',
            width: 2
          })
        })
      }))
    }

    // 开始
    function startAnimation() {
      if (animating) {
        stopAnimation(false)
      }
      // 隐藏初始化图标
      (geoMarker.getGeometry()).setCoordinates(routeCoords[0])
      geoMarker.setStyle(styles.geoMarkerHide)
      animating = true
      now = new Date().getTime()
      map.on('postcompose', moveFeature)
      map.render()
    }

    // 停止
    function stopAnimation(ended) {
      animating = false
      if (ended) {
        (geoMarker.getGeometry()).setCoordinates(routeCoords[routeLength - 1])
        const dx = routeCoords[routeLength - 2][0] - routeCoords[routeLength - 1][0]
        const dy = routeCoords[routeLength - 2][1] - routeCoords[routeLength - 1][1]
        const rotation = Math.atan2(dy, dx)
        const carStyle = new ol.style.Style({
          image: new ol.style.Icon({
            src: imgSrc,
            rotateWithView: false,
            rotation: -rotation,
            scale: 0.75
          })
        })
        geoMarker.setStyle(carStyle)
        map.un('postcompose', moveFeature)
      } else {
        (geoMarker.getGeometry()).setCoordinates(routeCoords[0])
      }
    }

    // 暂停
    function pauseAnimation() {

    }

    // 继续
    function resumeAnimation() {

    }

    return {
      start: startAnimation,
      pause: pauseAnimation,
      resume: resumeAnimation,
      stop: stopAnimation
    }
  }
}
