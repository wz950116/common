<template>
  <div :id="idname" class="basemap"></div>
</template>
<script>
export default {
  props: {
    zoom: {
      type: [Number, String],
      default: 15
    },
    idname: {
      type: String,
      default: 'basemap'
    },
    // 是否添加绘制工具栏
    addControls: {
      type: Boolean,
      default: false
    },
    // 绘制工具栏配置参数
    controlOptions: {
      type: Object,
      default: () => {
        return {
          position: 'topright',
          drawPolygon: true, // 添加绘制多边形
          drawMarker: true, // 添加按钮以绘制标记
          drawCircleMarker: true, // 添加按钮以绘制圆形标记
          drawPolyline: true, // 添加按钮绘制线条
          drawRectangle: true, // 添加按钮绘制矩形
          drawCircle: true, //  添加按钮绘制圆圈
          editMode: true, //  添加按钮编辑多边形
          dragMode: true, //   添加按钮拖动多边形
          cutPolygon: true, // 添加一个按钮以删除图层里面的部分内容
          removalMode: true // 清除图层
        }
      }
    }
  },
  data() {
    return {
      map: null,
      rectangleLayer: [],
      drawObj: '',
      layerGroup: null,
      lineGroup: null,
      marker: null,
      markers: null,
      // 多条轨迹线
      routeLine: null,
      polylineGroup: null,
      animatedMarker: null,
      editedData: [],
      linesArr: [],
      // 绘制图形
      drawPolygonObj: {
        lines: {},
        tempLines: {},
        polygonList: {},
        points: [],
        faceLines: [],
        faceTempLines: [],
        facePolygonList: []
      },
      markerGroup: [],
      defaultPonit: require('@/assets/images/point.png')
    }
  },
  mounted() {
    this.initMap()
  },
  methods: {
    initMap() {
      this.rectangleLayer = []
      this.map = this.$L.map(this.idname, {
        crs: window.L.CRS.EPSG4326, // leaflet默认是3857坐标系
        zoom: this.zoom,
        minZoom: 12,
        maxZoom: 19,
        maxNativeZoom: 19,
        center: [30.73625, 116.82467],
        zoomControl: false, // 禁用放大缩小按钮
        doubleClickZoom: false, // 禁用双击放大
        attributionControl: false, // 移除右下角leaflet标识
        useDefault: true
      })
      this.$L.tileLayer('http://t1.tianditu.com/vec_c/wmts?layer=vec&style=default&tilematrixset=c&Service=WMTS&Request=GetTile&Version=1.0.0&Format=tiles&TileMatrix={z}&TileCol={x}&TileRow={y}&tk=ef63801764261c156ba74a40612a717b', {
        maxZoom: 19,
        tileSize: 256,
        zoomOffset: 1
      }).addTo(this.map)
      this.$L.tileLayer('http://t1.tianditu.com/cva_c/wmts?layer=cva&style=default&tilematrixset=c&Service=WMTS&Request=GetTile&Version=1.0.0&Format=tiles&TileMatrix={z}&TileCol={x}&TileRow={y}&tk=ef63801764261c156ba74a40612a717b', {
        maxZoom: 19,
        tileSize: 256,
        zoomOffset: 1
      }).addTo(this.map)
      this.$emit('mapInit', this.map)
    },
    setZoomAndCenter(points, zoom) {
      this.map.setView(points, zoom || this.map.getZoom())
    },
    panTo(points) {
      this.map.panTo(points)
    },
    createAndAddMarker({ points, callBack, popUp, iconUrl = this.defaultPonit }) {
      this.layerGroup && this.map.removeLayer(this.layerGroup)
      this.layerGroup = null
      this.marker = []
      const myIcon = this.$L.icon({
        iconUrl,
        iconSize: [40, 56],
        iconAnchor: [20, 28],
        popupAnchor: [-3, -56]
      })
      const bigIcon = this.$L.icon({
        iconUrl,
        iconSize: [60, 84],
        iconAnchor: [30, 56],
        popupAnchor: [-3, -56]
      })
      points.map((item) => {
        if (item.longitude && item.latitude) {
          const m = new this.$L.Marker([item.latitude, item.longitude], {
            icon: myIcon,
            riseOnHover: true
          })
          m.extra = {
            ...item
          }
          // 弹窗绑定
          popUp &&
            m.bindPopup(popUp, {
              // 始终保持在视野内
              keepInView: true,
              // autoPan: false
              autoPanPaddingTopLeft: this.$L.point(520, 150),
              autoPanPaddingBottomRight: this.$L.point(500, 80)
            })
          // 监听弹窗打开、关闭
          m.on('popupopen', () => {
            m.setIcon(bigIcon)
            this.$emit('popUpOpenOrClose', true)
          })
          m.on('popupclose', () => {
            if (m.dragging) {
              m.setIcon(myIcon)
              this.$emit('popUpOpenOrClose', false)
            }
          })
          // 点击事件
          callBack && m.on('click', callBack)
          this.marker.push(m)
        }
      })
      this.layerGroup = this.$L.layerGroup(this.marker)
      this.map.addLayer(this.layerGroup)
    },
    getLayers() {
      // 获取所有绘制图层信息
      return this.rectangleLayer
    },
    getAllCreatedLayer() {
      return this.drawObj
    },
    getAllEditedLayer() {
      return this.editedData
    },
    creatPolygon(latlngs, options, type) {
      if (type === 'Line') {
        // 绘制线段
        this.drawObj = this.$L.polyline(latlngs, { ...options }).addTo(this.map)
        this.rectangleLayer.push({
          id: this.drawObj._leaflet_id,
          shape: type,
          layer: this.drawObj,
          latlngs: this.drawObj._latlngs
        })
      } else if (type === 'Polygon') {
        // 绘制多边形
        this.drawObj = this.$L.polygon(latlngs, { ...options }).addTo(this.map)
        this.rectangleLayer.push({
          id: this.drawObj._leaflet_id,
          shape: type,
          layer: this.drawObj,
          latlngs: this.drawObj._latlngs
        })
      }
    },
    openEditPolygonEvent() {
      // 开启多边形编辑
      this.drawObj.pm.enable({
        allowSelfIntersection: false
      })
    },
    openAllEdit() {
      // 全局编辑切换
      this.map.pm.toggleGlobalEditMode()
    },
    openAllRemove() {
      // 全局清除切换
      this.map.pm.toggleGlobalRemovalMode()
      this.map.on('pm:remove', () => {
        this.drawObj = ''
        this.rectangleLayer = []
      })
    },
    globalEditEnabled() {
      // 判断是否全局编辑,有返回值
      return this.map.pm.globalEditEnabled()
    },
    // 关闭弹窗
    closePopup() {
      this.map.closePopup()
    },
    removeLine(row) {
      const layer = this.lineGroup.getLayers().find((x) => x.options.id === row.sn)

      const index = this.linesArr.findIndex((x) => x.options.id === row.sn)
      if (index !== -1) {
        this.linesArr.splice(index, 1)
      }
      this.lineGroup && this.map.removeLayer(layer)
    },
    removeAll() {
      this.layerGroup && this.map.removeLayer(this.layerGroup)
      this.layerGroup = null
      this.marker = []
      this.lineGroup && this.map.removeLayer(this.lineGroup)
      this.lineGroup = null
      this.linesArr = []
    },
    drawMultiLine(track) {
      const list = track.data.map((it) => {
        return [it.latitude, it.longitude]
      })
      const routeLine = this.$L
        .polyline(list, {
          weight: 4,
          id: track.sn
        })
        .addTo(this.map)
      this.linesArr.push(routeLine)
      this.map.fitBounds(routeLine.getBounds())
      this.lineGroup = this.$L.layerGroup(this.linesArr, {
        id: track.sn
      })
      this.map.addLayer(this.lineGroup)
    },
    /**
     * 绘制轨迹
     * @param {Array} track 轨迹数组
     * @param {Function} stopCallback 停止播放时的回调函数
     * @param {Object} polylineStyle 基础线的样式
     * @param {Object} passedPolylineStyle 动画线的样式
     */
    drawTrack(track, speed = 1) {
      this.animatedMarker && this.map.removeLayer(this.animatedMarker)
      this.markers = []
      const iconList = [
        this.$L.icon({
          iconUrl: require('@/assets/images/car.png'),
          iconSize: [37, 26],
          iconAnchor: [19, 13]
          // popupAnchor: [-3, -76]
        })
      ]
      const list = track.map((it) => {
        return [it.latitude, it.longitude]
      })
      // 动态marker
      const routeLine = this.$L
        .polyline(list, {
          weight: 8
        })
        .addTo(this.map)
      // 实时轨迹线
      const realRouteLine = this.$L
        .polyline([], {
          weight: 8,
          color: '#FF9900'
        })
        .addTo(this.map)
      // 轨迹方向箭头
      const polylineDecorator = this.$L
        .polylineDecorator(routeLine, {
          patterns: [
            {
              repeat: 50,
              symbol: this.$L.Symbol.arrowHead({
                pixelSize: 5,
                headAngle: 75,
                polygon: false,
                pathOptions: {
                  stroke: true,
                  weight: 2,
                  color: '#FFFFFF'
                }
              })
            }
          ]
        })
        .addTo(this.map)
      this.animatedMarker = this.$L
        .animatedMarker(routeLine.getLatLngs(), {
          speedList: [1],
          interval: 1000 / speed, // 默认为100mm 越大速度越小
          icon: iconList[0],
          playCall: (latlng) => {
            newLatlngs.push(latlng)
            realRouteLine.setLatLngs(newLatlngs)
          }
        })
        .addTo(this.map)
      let newLatlngs = [routeLine.getLatLngs()[0]]
      let speetX = 1 // 默认速度倍数
      this.map.panTo(list[0])
      this.animatedMarker.start()
      const that = this
      return {
        // 绘制已行走轨迹线（橙色那条）
        updateRealLine(latlng) {
          newLatlngs.push(latlng)
          realRouteLine.setLatLngs(newLatlngs)
        },
        // 加速
        speetUp(speed) {
          speetX = 1 * speed
          that.animatedMarker.setSpeetX(speetX)
        },
        // 减速
        speetDown() {
          speetX = speetX / 2
          that.animatedMarker.setSpeetX(speetX)
        },
        // 开始
        startClick() {
          that.animatedMarker.start()
        },
        // 开始
        continueClick() {
          that.animatedMarker.continue()
        },
        // 暂停
        pauseClick() {
          that.animatedMarker.pause()
        },
        // 停止
        stopClick() {
          newLatlngs = []
          that.animatedMarker.stop()
        },
        clearTrack() {
          that.map.removeLayer(polylineDecorator)
          that.map.removeLayer(realRouteLine)
          that.map.removeLayer(routeLine)
          that.animatedMarker && that.map.removeLayer(that.animatedMarker)
          that.animatedMarker = null
        }
      }
    },
    // 多边形绘画
    drawPolygon(cb) {
      // 先清除历史图形
      this.removePolygon()
      this.$message.info('请在地图绘制多边形，双击结束自动生成')
      // 绘制
      this.drawPolygonObj.lines = this.$L.polyline([], { color: '#ff0000', fillColor: 'ff0000', fillOpacity: 1 })
      this.drawPolygonObj.tempLines = this.$L.polyline([], { color: '#ff0000', fillColor: 'ff0000', fillOpacity: 1 })
      this.map.addLayer(this.drawPolygonObj.lines)
      this.map.addLayer(this.drawPolygonObj.tempLines)
      // 点击地图
      this.map.on('click', (e) => {
        this.drawPolygonObj.points.push([e.latlng.lat, e.latlng.lng])
        this.drawPolygonObj.lines.addLatLng(e.latlng)
        this.map.addLayer(this.drawPolygonObj.lines)
        this.drawPolygonObj.faceLines.push(this.drawPolygonObj.lines)
      })
      // 移动
      this.map.on('mousemove', (e) => {
        if (this.drawPolygonObj.points.length > 0) {
          const ls = [this.drawPolygonObj.points.slice(-1)[0], [e.latlng.lat, e.latlng.lng]]
          this.drawPolygonObj.tempLines.setLatLngs(ls)
          this.drawPolygonObj.faceTempLines.push(this.drawPolygonObj.tempLines)
        }
      })
      // 双击地图
      this.map.on('dblclick', () => {
        this.drawPolygonObj.polygonList = this.$L.polygon([this.drawPolygonObj.points]).addTo(this.map)
        this.map.addLayer(this.drawPolygonObj.polygonList)
        this.drawPolygonObj.facePolygonList.push(this.drawPolygonObj.polygonList)
        cb && cb(this.drawPolygonObj.points)
        this.drawPolygonObj.points = []
        this.drawPolygonObj.lines.setLatLngs([])
        // 删除事件
        this.map.off('click')
      })
    },
    // 移除绘制的多边形
    removePolygon() {
      this.drawPolygonObj.points.forEach((item) => {
        this.map.removeLayer(item)
      })
      this.drawPolygonObj.faceLines.forEach((item) => {
        this.map.removeLayer(item)
      })
      this.drawPolygonObj.faceTempLines.forEach((item) => {
        this.map.removeLayer(item)
      })
      this.drawPolygonObj.facePolygonList.forEach((item) => {
        this.map.removeLayer(item)
      })
      this.drawPolygonObj = {
        lines: {},
        tempLines: {},
        polygonList: {},
        points: [],
        faceLines: [],
        faceTempLines: [],
        facePolygonList: []
      }
      this.map.off('click')
      this.map.off('mousemove')
      this.map.off('dblclick')
    },
    // 添加聚合点 params: 类型、点位数据、点击回调、图标样式、点击弹窗组件refs
    /**
     * 添加聚合点
     * @param {String} type 类型，用于定位删除
     * @param {Array|Object} data 点位数据，例如：[{ longitude: '', latitude: '', ... }]
     * @param {Function} cb 点击回调方法
     * @param {Object} icon 图标
     * @param {Object} popUp 点击打开的弹窗，例如：this.$refs.xxx
    */
    createAndAddClusterMarker({ type, data, cb, icon = {}, popUp = null }) {
      const markersGroup = new this.$L.MarkerClusterGroup()
      const divIconMarker = (list) => {
        list.forEach((item) => {
          const _point = {
            ...item,
            lng: item.longitude,
            lat: item.latitude
          }
          const marker = this.$L.marker(_point, { icon: this.createIcon(icon) })
          if (popUp) {
            marker.bindPopup(popUp, {
              keepInView: true, // 始终保持在视野内
              autoPanPaddingTopLeft: this.$L.point(520, 150),
              autoPanPaddingBottomRight: this.$L.point(500, 80)
            })
          }
          // 添加点击事件传数据
          if (item) {
            marker.on('click', () => {
              cb && cb(item)
            })
          }
          markersGroup.addLayer(marker).addTo(this.map)
        })
        // 点集合加入数组
        this.markerGroup.push({
          type,
          list: markersGroup
        })
      }

      if (Array.isArray(data)) {
        divIconMarker(data)
      } else {
        divIconMarker([data])
      }
    },
    // 移除聚合点
    removeClusterMarker(type) {
      if (this.markerGroup.length) {
        let delIndex = null
        this.markerGroup.forEach((item, index) => {
          if (item.type === type) {
            item.list.clearLayers()
            delIndex = index
          }
        })
        if (delIndex) {
          this.markerGroup.splice(delIndex, 1)
        }
      }
    },
    // 创建图标icon
    createIcon(option) {
      const icon = {
        iconUrl: require('@/assets/images/point.png'), // 默认图标
        iconSize: [40, 56],
        iconAnchor: [20, 28],
        popupAnchor: [-3, -56],
        ...option
      }
      return this.$L.icon({ ...icon })
    }
  },
  destroy() {
    this.$L = null
    this.map = null
  }
}
</script>
<style lang="scss">
.basemap {
  overflow: hidden;
  width: 100%;
  height: 100%;
}
.leaflet-popup-close-button.leaflet-popup-close-button {
  padding: 0 4px 0 4px !important;
}
.leaflet-popup-content-wrapper.leaflet-popup-content-wrapper {
  border-radius: 4px;
  padding: 6px 16px;
  .leaflet-popup-content.leaflet-popup-content {
    font-size: 20px;
    width: auto !important;
  }
}
</style>
