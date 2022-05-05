## 使用方法
``` bash
<CgMap ref="cgMap" style="height: 100%" @map-change="handleMapChange"></CgMap>

handleMapChange(map) {
  this.$cgMap = map
}

addPoints() {
  const markers = []
  const arr = [[30.647273, 116.74841], [30.787351, 116.871868]]
  arr.forEach(i => {
    const icon = window.L.icon({
      iconUrl: '', // 图片地址
      iconSize: [52 / 2, 69 / 2],
      iconAnchor: [52 / 4, 69 / 2], // 相对偏移的位置，默认落地点为左上方，需要偏移至正下方，横向一半、纵向全部
      popupAnchor: [] // 弹出窗口相对于图标锚点“打开”的点的坐标。
    })
    const marker = window.L.marker(i, { icon })
    marker.on('click', (e) => {
      // 点击打开详情
      console.log(e)
    })
    markers.push(marker)
  })
  this.pointLayer = window.L.featureGroup(markers)
  this.pointLayer.addTo(this.$cgMap.$map)
}
```