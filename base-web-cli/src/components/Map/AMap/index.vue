<template>
  <div class="map-demo">
    <div ref="container" style="width: 100%; height: 100%"></div>
    <div class="map-search">
      <c-select v-model="searchVal" filterable remote reserve-keyword placeholder="请输入地址" :remote-method="searchPlace" popper-class="address-popper" :loading="loading" value-key="name">
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
import { MapContainer } from './amap'
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
  data() {
    return {
      map: null,
      defaultData: [],
      searchList: [],
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
    },
    // 搜索兴趣点列表
    searchPlace(query) {
      if (query !== '') {
        this.loading = true
        this.map.searchPosAndMarker(query, (data) => {
          this.loading = false
          this.addressOptions = data
        })
      } else {
        this.addressOptions = []
      }
    },
    // 设置点标记
    initMarker([lng, lat]) {
      if (!lng || !lat) return
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
    },
    // 获取地址
    getAddress(lnglat) {
      this.map.geocoder.getAddress(lnglat, (status, result) => {
        if (status === 'complete' && result.regeocode) {
          this.$refs.myForm.formData[0].address = result.regeocode.formattedAddress
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
        this.getAddress([this.form.longitude, this.form.latitude])
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.map-container {
  position: relative;
  height: 100%;
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
