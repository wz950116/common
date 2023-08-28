import AMap from 'AMap'
import person from './imgs/ryMarker.png'
import personActive from './imgs/ryMarkerActive.png'
import car from './imgs/clMarker.png'
import carActive from './imgs/clMarkerActive.png'
import camera from './imgs/jkMarker.png'
import cameraActive from './imgs/jkMarkerActive.png'
import event from './imgs/sjMarker.png'
import eventActive from './imgs/sjMarkerActive.png'
import part from './imgs/bjMarker.png'
import partActive from './imgs/bjMarkerActive.png'
import location from './imgs/location-icon.png'
import cluster from './imgs/cluster.png'

export default {
  // 定位图标
  location: {
    image: location,
    imageSize: new AMap.Size(18, 27),
    size: new AMap.Size(18, 27)
  },
  // 聚合图标收起样式
  clusterStyle: [{
    url: cluster,
    size: new AMap.Size(64, 64),
    textColor: '#fff',
    textSize: 15
  }],
  // 聚合图标展开样式
  clusterMarker: {
    part: {
      image: part,
      imageSize: new AMap.Size(36, 48),
      size: new AMap.Size(36, 48)
    }
  }
}

export const MAP_STYLE = {
  person: new AMap.Icon({
    size: new AMap.Size(36, 48),
    image: person,
    imageSize: new AMap.Size(36, 48)
  }),
  personActive: new AMap.Icon({
    size: new AMap.Size(72, 96),
    image: personActive,
    imageSize: new AMap.Size(72, 96)
  }),
  car: new AMap.Icon({
    size: new AMap.Size(36, 48),
    image: car,
    imageSize: new AMap.Size(36, 48)
  }),
  carActive: new AMap.Icon({
    size: new AMap.Size(72, 96),
    image: carActive,
    imageSize: new AMap.Size(72, 96)
  }),
  camera: new AMap.Icon({
    size: new AMap.Size(36, 48),
    image: camera,
    imageSize: new AMap.Size(36, 48)
  }),
  cameraActive: new AMap.Icon({
    size: new AMap.Size(72, 96),
    image: cameraActive,
    imageSize: new AMap.Size(72, 96)
  }),
  event: new AMap.Icon({
    size: new AMap.Size(36, 48),
    image: event,
    imageSize: new AMap.Size(36, 48)
  }),
  eventActive: new AMap.Icon({
    size: new AMap.Size(72, 96),
    image: eventActive,
    imageSize: new AMap.Size(72, 96)
  }),
  part: new AMap.Icon({
    size: new AMap.Size(36, 48),
    image: part,
    imageSize: new AMap.Size(36, 48)
  }),
  partActive: new AMap.Icon({
    size: new AMap.Size(72, 96),
    image: partActive,
    imageSize: new AMap.Size(72, 96)
  })
}

export const POINT_STYLE_LIST = [
  { url: camera, size: new AMap.Size(30, 35), anchor: new AMap.Pixel(0, 35) }
]