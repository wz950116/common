<template>
  <div class="selectMap-container basePage">
    <div class="body">
      <map-com ref="map" @mapInit="mapInit"></map-com>
    </div>
    <div class="search">
      <cmb-search v-model="searchKey" :class="['search-input', { 'search-input-expand': isExpand }]" clearable @search="onSearch" @input="onSearch" placeholder="请输入地点搜索" />
      <div v-if="isExpand" class="list-wrapper">
        <div class="btn-collapse" @click="onCollapse"></div>
        <div v-if="searchList.length" class="list">
          <div v-for="(item, index) in searchList" :key="index" class="list-item" @click="selectAddress(item)">
            <div class="list-item-l">
              <div class="list-item-l-name">{{ item.name }}</div>
              <div class="list-item-l-address">{{ item.address }}</div>
            </div>
            <div v-if="item.select" class="list-item-r">
              <cmb-icon name="success" />
            </div>
          </div>
        </div>
      </div>
    </div>
    <div v-if="!isExpand">
      <div class="right-button">
        <img src="@/assets/images/position.png" alt="" @click="onPosition" />
        <img src="@/assets/images/expand.png" alt="" @click="isExpand = !isExpand" />
      </div>
      <div class="list-collapse">
        <cmb-swipe :show-indicators="false" @change="onChange">
          <cmb-swipe-item v-for="(item, index) in searchList" :key="index" class="list-collapse-item">
            <div class="list-collapse-item-name">{{ item.name }}</div>
            <div class="list-collapse-item-address">{{ item.address }}</div>
            <cmb-button class="btn" type="info" @click="confirm(item)">确定</cmb-button>
          </cmb-swipe-item>
        </cmb-swipe>
      </div>
    </div>
  </div>
</template>

<script>
import { Toast } from '@cci/mcui'
import { queryDataByCoordinate, queryAdministrativeDivisionByPage } from '@/api'
import { transformPoint } from '@/utils'
export default {
  components: {
    MapCom: () => import('@/components/map')
  },
  data() {
    return {
      map: null,
      longitude: '',
      latitude: '',
      searchKey: '',
      searchList: [],
      isExpand: false,
      currentAddress: null
    }
  },
  watch: {
    map(val) {
      if (val) {
        this.onMarker(this.longitude, this.latitude)
      }
    }
  },
  created() {
    const { longitude, latitude } = this.$route.query
    if (longitude && latitude) {
      this.longitude = longitude
      this.latitude = latitude
    }
  },
  methods: {
    mapInit(map) {
      this.map = map
      this.map.on('click', ({ latlng }) => {
        this.longitude = latlng.lng
        this.latitude = latlng.lat
        this.onMarker(this.longitude, this.latitude)
      })
    },
    async onMarker(lng, lat) {
      if (lng && lat) {
        // 清除搜索结果
        this.searchList = []
        this.searchKey = ''
        this.$refs.map.setZoomAndCenter({ lat, lng })
        this.$refs.map.createAndAddMarker({
          points: [{ latitude: lat, longitude: lng }],
          iconUrl: require('@/assets/images/point.png')
        })
        // 把点击获取的百度坐标转换成天地图坐标作为参数请求详情
        const latlng = transformPoint([lng, lat], 'BD09', 'WGS84')
        try {
          const { data } = await queryDataByCoordinate({
            latitude: latlng[1],
            longitude: latlng[0]
          })
          // 依旧以百度坐标展示和保存
          this.searchList = [
            {
              ...data,
              latitude: lat,
              longitude: lng
            }
          ]
        } catch (e) {
          Toast.fail('查找失败！')
        }
      }
    },
    onSearch() {
      if (this.searchKey) {
        this.searchList = []
        queryAdministrativeDivisionByPage({
          province: '山西省',
          city: '晋中市',
          pageNum: 1,
          pageSize: 10,
          area: '',
          street: '',
          roadName: '',
          communityName: '',
          name: this.searchKey
        }).then(({ data }) => {
          this.searchList =
            data.list.map((v) => {
              // 请求回来的天地图坐标转换成百度坐标展示
              const latlng = transformPoint([v.longitude, v.latitude], 'WGS84', 'BD09')
              return {
                ...v,
                select: false,
                longitude: latlng[0],
                latitude: latlng[1]
              }
            }) || []
          if (this.searchList.length) {
            this.$refs.map.setZoomAndCenter({ lat: this.searchList[0].latitude, lng: this.searchList[0].longitude })
          }
        })
      }
    },
    onPosition() {
      if (this.$cci) {
        this.$cci.getLocation({ type: 'bd0911' }, (result) => {
          this.onMarker(result.longitude, result.latitude)
        })
      }
    },
    onCollapse() {
      this.isExpand = false
      if (this.currentAddress) {
        this.onMarker(this.currentAddress.longitude, this.currentAddress.latitude)
      }
    },
    onChange(index) {
      console.log(index, this.searchList[index])
      this.$refs.map.setZoomAndCenter({ lat: this.searchList[index].latitude, lng: this.searchList[index].longitude })
    },
    selectAddress(item) {
      this.searchList.forEach((i) => {
        i.select = false
      })
      item.select = true
      this.currentAddress = item
    },
    confirm(data) {
      console.log(data, 111)
      if (!data.streetCode.trim()) {
        Toast.fail('街道信息不存在请重新选择！')
        return
      }
      if (!data.communityCode.trim()) {
        Toast.fail('社区信息不存在请重新选择！')
        return
      }
      this.$route.query.longitude = data.longitude
      this.$route.query.latitude = data.latitude
      if (data) {
        this.$route.query.addressComponent = data
      }
      this.$router.back()
    }
  }
}
</script>
<style lang="scss" scoped>
.selectMap-container {
  .search {
    background: #ffffff;
    .search-input {
      position: fixed;
      top: 44px;
      left: 0;
      right: 0;
      z-index: 999;
      transition: 0.5s top;
    }
    .search-input-expand {
      top: 56px;
      left: 12px;
      right: 12px;
      padding: 0;
      border-radius: 8px;
      box-shadow: 0px 2px 6px rgba(0, 0, 0, 0.04);
      z-index: 999;
      .van-search__content {
        background: #ffffff;
      }
    }
    .list-wrapper {
      position: fixed;
      top: 128px;
      left: 12px;
      right: 12px;
      bottom: 34px;
      padding: 12px 14px;
      border-radius: 8px;
      box-shadow: 0px 2px 6px rgba(0, 0, 0, 0.04);
      background: #ffffff;
      z-index: 999;
      .btn-collapse {
        width: 41px;
        height: 4px;
        background: #a1a1a1;
        border-radius: 2px;
        margin: 0 auto 12px;
      }
      .list {
        height: calc(100% - 16px);
        overflow: auto;
        .list-item {
          display: flex;
          align-items: center;
          height: 90px;
          line-height: 28px;
          border-bottom: 1px solid #f2f4f7;
          &-l {
            width: calc(100% - 25px);
            &-name {
              width: 100%;
              font-size: 18px;
              font-weight: 500;
              color: #333333;
              white-space: nowrap;
              overflow: hidden;
              text-overflow: ellipsis;
            }
            &-address {
              width: 100%;
              font-size: 14px;
              color: #999999;
              white-space: nowrap;
              overflow: hidden;
              text-overflow: ellipsis;
            }
          }
          &-r {
            width: 20px;
            color: #1989fa;
          }
        }
      }
    }
  }
  .right-button {
    position: fixed;
    right: 6px;
    bottom: 183px;
    z-index: 999;
    img {
      display: block;
      width: 44px;
      height: 44px;
    }
  }
  .list-collapse {
    position: fixed;
    bottom: 34px;
    left: 0;
    right: 0;
    z-index: 999;
    .van-swipe {
      width: 100%;
      .list-collapse-item {
        width: calc(100vw - 20px) !important;
        background: #ffffff;
        border-radius: 8px;
        box-shadow: 0px 4px 12px rgba(0, 0, 0, 0.12);
        padding: 12px;
        margin: 0 auto;
        box-sizing: border-box;
        &-name {
          width: 309px;
          color: #333333;
          font-size: 18px;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        &-address {
          width: 309px;
          color: #666666;
          font-size: 14px;
          line-height: 30px;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .btn {
          width: 309px;
          height: 44px;
          line-height: 44px;
          text-align: center;
          border-radius: 8px;
          margin-top: 10px;
        }
      }
    }
  }
}
</style>
