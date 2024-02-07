<template>
  <div class="map-container">
    <div ref="container" style="width: 100%; height: 100%"></div>
    <div class="map-search">
      <c-select v-model="searchVal" filterable remote reserve-keyword placeholder="请选择地址" :remote-method="searchPlace" popper-class="address-popper" :loading="loading" value-key="name">
        <c-option v-for="item in addressOptions" :key="item.id" :label="item.name" :value="item">
          <div class="address-item" @click="clickArea(item)">
            <span class="name">{{ item.name }}</span>
            <span class="address">{{ item.address | textEclipse }}</span>
          </div>
        </c-option>
      </c-select>
    </div>
  </div>
</template>
<script>
import AMap from 'AMap'
import { MapContainer, searchPosAndMarker } from './amap'
export default {
  filters: {
    textEclipse(val) {
      if (val.length > 25) {
        return val.substring(0, 35) + '...'
      } else {
        return val
      }
    }
  },
  props: {
    useClick: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      map: null,
      marker: null,
      searchVal: '',
      loading: false,
      addressOptions: [],
      form: {
        latitude: '',
        longitude: ''
      }
    }
  },
  mounted() {
    this.initMap()
  },
  methods: {
    // 初始化
    initMap() {
      this.map = new MapContainer({
        target: this.$refs.container,
        center: [120.565099, 30.630173],
        zoom: 12,
        clickHook: (map, e) => {
          console.log(map, e)
        }
      })
      this.$once('hook:berofeDestroy', () => {
        this.map.destroy()
        this.map = null
      })
      // 是否可点击地图打点
      this.useClick && this.map.map.on('click', (e) => {
        const { lng, lat } = e.lnglat
        this.initMarker([lng, lat])
        this.$emit('map-click', e.lnglat)
      })
    },
    // 搜索兴趣点列表
    searchPlace(query) {
      if (query !== '') {
        this.loading = true
        searchPosAndMarker(query, (data) => {
          this.loading = false
          this.addressOptions = data
        })
      } else {
        this.addressOptions = []
      }
    },
    // 设置点标记
    initMarker([lng, lat]) {
      // 1、自定义
      if (!lng || !lat) {
        this.removeMarker()
        return
      }
      const lnglat = new AMap.LngLat(lng, lat)
      if (!this.marker) {
        this.marker = new AMap.Marker({
          position: lnglat,
          map: this.map.map
        })
      } else {
        this.marker.setPosition(lnglat)
      }
      this.map.map.setCenter(lnglat)
      // 2、调用封装方法
      // this.map.addPoints({
      //   points: [{ lng, lat, popup: this.$refs.xxx, offset: new AMap.Pixel(-18, -48), popupopen: () => {} }],
      //   showPopup: true // 点击打开弹窗，弹窗属性由points参数的属性控制
      // })
    },
    removeMarker() {
      if (this.marker) {
        this.map.map.remove(this.marker)
        this.marker = null
      }
    },
    // 获取地址
    getAddress(lnglat, cb) {
      this.map.geocoder.getAddress(lnglat, (status, result) => {
        if (status === 'complete' && result.regeocode) {
          cb(result.regeocode.formattedAddress)
        } else {
          console.error('根据经纬度查询地址失败')
        }
      })
    },
    // 点击兴趣点结果
    clickArea(e) {
      if (e.location && e.location.lat && e.location.lng) {
        this.form.longitude = e.location.lng
        this.form.latitude = e.location.lat
        this.initMarker([this.form.longitude, this.form.latitude])
        this.$emit('map-click', e.location)
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.map-container {
  position: relative;
  height: 100%;
  height: 300px;
  .map-search {
    position: absolute;
    top: 20px;
    left: 20px;
    width: 226px;
    z-index: 999;

    :deep(.el-input__inner) {
      border-radius: 2px;
      border: 0;
      box-shadow: 0px 2px 4px 0px rgba(0, 0, 0, 0.16);
    }

    :deep(.el-input__suffix) {
      line-height: 32px;
      right: 12px;

      .el-icon-search {
        width: 24px;
        height: 24px;
      }

      .custom-icon-wrong {
        width: 12px;
        height: 12px;
        cursor: pointer;
        position: relative;
        right: 6px;
      }
    }
  }
}
</style>
