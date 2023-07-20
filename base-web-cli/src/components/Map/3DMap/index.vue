<script>
// import { CMap, GaodeMapV2 } from 'cci-map'
// import Tiles3DLayer from 'cci-tiles3d'
import * as Cesium from 'cesium'
import 'cesium/Build/Cesium/Widgets/widgets.css'

export default {
  mounted() {
    Cesium.Ion.defaultAccessToken =
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiJmYmE2YWEzOS1lZDUyLTQ0YWMtOTlkNS0wN2VhZWI3NTc4MmEiLCJpZCI6MjU5LCJpYXQiOjE2ODU2MzQ0Njl9.AswCMxsN03WYwuZL-r183OZicN64Ks9aPExWhA3fuLY'
      const viewer = new Cesium.Viewer('cesiumContainer')
      const tileset = new Cesium.Cesium3DTileset({
        url: '/tiles/3dtilesv2/tileset.json'
      })
      viewer.scene.primitives.add(tileset)
      viewer.camera.setView({
        destination: Cesium.Cartesian3.fromDegrees(112.74614077048861, 37.68732529157206, 4000.0),
        orientation: {
          heading: Cesium.Math.toRadians(0.0),
          pitch: Cesium.Math.toRadians(-45.0),
          roll: Cesium.Math.toRadians(0.0)
        }
      })
      // const scene = new CMap({
      //   id: 'map',
      //   map: new GaodeMapV2({
      //     style: 'dark',
      //     center: [112.759335, 37.693583], // 晋中
      //     // center: [121.502325, 31.238165], // 上海
      //     pitch: 90,
      //     rotation: -50,
      //     zoom: 16
      //   })
      // })
      // console.log(scene, Tiles3DLayer, 0)
      // scene.on('loaded', () => {
      //   console.log('loaded success')
      //   const layer = new Tiles3DLayer({
      //     url: '/tiles/3dtilesv2/tileset.json' // 3d Tiles ⼊⼝⽂件
      //     // url: 'https://a.amap.com/jsapi_demos/static/data3d/single.json' // 3d Tiles ⼊⼝⽂件
      //   }).source(
      //     {},
      //     {
      //       parser: {
      //         type: '3dtiles'
      //       }
      //     }
      //   )
      //   console.log(layer)
      //   scene.addLayer(layer)
      // })
  }
}
</script>
