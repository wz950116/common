<template>
  <div class="selectMap-container basePage">
    <cmb-sticky>
      <cmb-tabs v-model="active" color="#0482FF" title-active-color="#0482FF" @click="tabClick">
        <cmb-tab title="商户" :name="0"></cmb-tab>
        <cmb-tab title="部件" :name="1"></cmb-tab>
      </cmb-tabs>
    </cmb-sticky>
    <div class="body">
      <!-- 地图 -->
      <map-com ref="map" class="map" @mapInit="mapInit"></map-com>
      <!-- 商户 -->
      <div v-if="active === 0" class="store-list">
        <cmb-swipe ref="mySwiper" :show-indicators="false" @change="onStoreChange">
          <cmb-swipe-item v-for="item in storesList" :key="item.id">
            <div class="store-title">商户信息</div>
            <div class="store-content">
              <div>商户名称：{{ item.storeName }}</div>
              <div>统一社会信用代码：{{ item.uniformCreditCode }}</div>
              <div>经营类型：{{ item.storeTypeDesc }}</div>
              <div>经营状态：{{ item.operationStatusDesc }}</div>
              <div>负责人：{{ item.principal }}</div>
              <div>联系电话：{{ item.principalTel }}</div>
              <div>商户地址：{{ item.address }}</div>
            </div>
          </cmb-swipe-item>
        </cmb-swipe>
      </div>
      <!-- 部件 -->
      <div v-if="active === 1">
        <cmb-popup v-model="showPicker" position="bottom" round :close-on-click-overlay="false">
          <div class="bar-title">
            <div class="btn" @click="showPicker = false">取消</div>
            <div class="name">点位选择</div>
            <div class="btn" @click="onConfirm">确定</div>
          </div>
          <cmb-tree-select :items="partList" :active-id.sync="activeId" :main-active-index.sync="activeIndex" />
        </cmb-popup>
        <div v-if="showPartDetail" class="part-detail">
          <div class="part-detail-title">{{ partDetail.smallName }}</div>
          <div class="part-detail-info">{{ partDetail.address }}</div>
        </div>
      </div>
      <!-- 图标 -->
      <div :class="['right-button', { 'right-button-store': active === 0 }]">
        <img v-if="active === 1" src="@/assets/images/filter.png" alt="" @click="selectPartTree" />
        <img src="@/assets/images/position.png" alt="" @click="getLocation" />
      </div>
    </div>
  </div>
</template>

<script>
import { getUnitInfoTree, findById, findStores, findUnits } from '../store'
export default {
  components: {
    MapCom: () => import('@/components/map')
  },
  data() {
    return {
      map: null,
      marker: null,
      longitude: '',
      latitude: '',
      addressInfo: null,
      active: 0,
      storesList: [],
      partList: [],
      activeId: null,
      activeIndex: 0,
      showPicker: false,
      partDetail: {},
      showPartDetail: false
    }
  },
  created() {
    this.initData()
  },
  methods: {
    initData() {
      findStores({}).then(({ data, success }) => {
        if (success) {
          this.storesList = data.stores || []
          this.onClusterMarker(this.storesList)
          this.onStoreChange(0)
        }
      })
    },
    mapInit(map) {
      this.map = map
    },
    // 聚合点
    onClusterMarker(data) {
      if (data && data.length) {
        this.remove()
        this.$refs.map.createAndAddClusterMarker({
          type: 'mapLook',
          data: data.map((v) => {
            return { ...v, lng: v.longitude, lat: v.latitude }
          }),
          cb: (e) => {
            if (e.id) {
              // 商户下点击某个点swiper切换到这个点详情展示
              if (this.active === 0) {
                const index = this.storesList.map((v) => v.id).indexOf(e.id)
                this.$refs.mySwiper.swipeTo(index)
              }
            }
          },
          icon: {
            iconUrl: require('@/assets/images/point.png'),
            iconSize: [28, 40],
            highlight: false
          }
        })
      }
    },
    // 移除聚合
    remove() {
      if (this.map) {
        this.$refs.map.removeClusterMarker('mapLook')
      }
    },
    tabClick(name) {
      this.remove()
      this.active = name
      this.activeId = null
      this.activeIndex = 0
      if (this.active === 0) {
        this.initData()
      }
    },
    selectPartTree() {
      this.showPicker = true
      getUnitInfoTree().then(({ data, success }) => {
        if (success) {
          this.partList = data.map((item) => {
            return {
              text: item.name,
              id: item.code,
              children: item.child.map((i) => {
                return {
                  text: i.name + '(' + i.number + ')',
                  id: i.code
                }
              })
            }
          })
        }
      })
    },
    async onConfirm() {
      this.showPartDetail = false
      const toast = this.$toast.loading({
        duration: 0,
        message: '加载中...',
        forbidClick: true
      })
      if (this.activeId) {
        const { data, success } = await findUnits(this.activeId)
        if (success) {
          this.onClusterMarker(data)
          this.$refs.map.setZoomAndCenter({ lat: data[0].latitude, lng: data[0].longitude })
          this.showPicker = false
          toast.clear()
        }
      }
    },
    onStoreChange(index) {
      findById({
        storeBaseId: this.storesList[index].id
      }).then(({ data, success }) => {
        if (success) {
          this.$set(this.storesList, index, data)
          this.$refs.map.setZoomAndCenter({ lat: data.latitude, lng: data.longitude })
        }
      })
    },
    getLocation() {
      this.$cci.getLocation({ type: 'bd0911' }, ({ latitude, longitude }) => {
        if (latitude && longitude) this.$refs.map.setZoomAndCenter({ lat: latitude, lng: longitude })
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.selectMap-container {
  .right-button {
    position: fixed;
    right: 6px;
    bottom: 156px;
    z-index: 999;
    &-store {
      bottom: 284px;
    }
    img {
      display: block;
      width: 44px;
      height: 44px;
    }
  }
  .map {
    height: calc(100vh - 88px);
  }
  .store-list {
    position: fixed;
    bottom: 12px;
    left: 0;
    right: 0;
    height: 240px;
    z-index: 999;
    .van-swipe {
      width: 100%;
      height: 100%;
      .van-swipe-item {
        width: calc(100vw - 20px) !important;
        background: #ffffff;
        border-radius: 8px;
        box-shadow: 0px 4px 12px 0px rgba(0, 0, 0, 0.12);
        padding: 12px;
        margin: 0 auto;
        box-sizing: border-box;
        .store-title {
          font-size: 18px;
          font-family: PingFang SC, PingFang SC-Medium;
          font-weight: 500;
          color: #333333;
          margin-bottom: 5px;
        }
        .store-content {
          height: 184px;
          line-height: 24px;
          overflow-y: auto;
          div {
            font-size: 14px;
            font-family: PingFang SC, PingFang SC-Regular;
            color: #666666;
          }
        }
      }
    }
  }
  .bar-title {
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 50px;
    padding: 0 16px;
    font-size: 16px;
    .name {
      color: #333333;
      font-weight: 500;
    }
    .btn {
      color: #0482ff;
    }
  }
  .part-detail {
    position: fixed;
    bottom: 34px;
    left: 12px;
    right: 12px;
    height: 106px;
    padding: 14px 10px;
    background: #ffffff;
    border-radius: 8px;
    box-shadow: 0px 4px 12px 0px rgba(0, 0, 0, 0.12);
    box-sizing: border-box;
    font-size: 14px;
    font-family: PingFang SC, PingFang SC-Regular;
    color: #333333;
    line-height: 24px;
    z-index: 999;
    &-title {
      font-size: 18px;
      font-family: PingFang SC, PingFang SC-Medium;
      font-weight: 500;
      margin-bottom: 5px;
    }
    &-info {
      height: 48px;
      overflow-y: auto;
    }
  }
}
</style>
