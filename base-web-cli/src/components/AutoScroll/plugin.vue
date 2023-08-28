<template>
  <div class="part3-list">
    <vue-seamless-scroll ref="seamlessScroll" :data="enforcementList" :class-option="optionSingleTime" class="seamless-warp">
      <ul class="list">
        <li class="part3-list-item" v-for="(item, i) in enforcementList" :key="i" @click="currentEnforcement = item">
          <div class="part3-list-item-time">{{ item.time }}</div>
          <div class="part3-list-item-type">{{ item.type }}</div>
          <div class="part3-list-item-address">{{ item.address }}</div>
        </li>
      </ul>
    </vue-seamless-scroll>
  </div>
</template>

<script>
import vueSeamlessScroll from 'vue-seamless-scroll'

export default {
  components: { vueSeamlessScroll },
  data() {
    return {
      currentEnforcement: {},
      enforcementList: [
        { time: '2022-07-15 12:00:00', type: '游摊小贩1', address: '白水东街桃苑路口', src: require('../image/video.jpg'), result: '未处理' },
        { time: '2022-07-15 12:00:00', type: '游摊小贩2', address: '白水东街桃苑路口', src: require('../image/video.jpg'), result: '已处理' },
        { time: '2022-07-15 12:00:00', type: '游摊小贩3', address: '白水东街桃苑路口', src: require('../image/video.jpg'), result: '未处理' },
        { time: '2022-07-15 12:00:00', type: '游摊小贩4', address: '白水东街桃苑路口', src: require('../image/video.jpg'), result: '未处理' },
        { time: '2022-07-15 12:00:00', type: '游摊小贩5', address: '白水东街桃苑路口', src: require('../image/video.jpg'), result: '未处理' }
      ]
    }
  },
  computed: {
    optionSingleTime() {
      return {
        step: 0.5,
        limitMoveNum: this.enforcementList.length,
        hoverStop: true,
        openWatch: true
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.part3-list {
  width: 497px;
  height: 76px;
  padding: 10px 0;
  background: #000 no-repeat center;
  overflow: hidden;
  &-item {
    display: flex;
    justify-content: space-between;
    line-height: 28px;
    font-size: 14px;
    color: #cccccc;
    padding: 0 16px;
    cursor: pointer;
    div {
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    &-time {
      width: 160px;
      margin-right: 10px;
    }
    &-type {
      width: 100px;
    }
    &-address {
      flex: 1;
      text-align: right;
    }
    &:hover {
      background: linear-gradient(90deg, rgba(24, 139, 217, 0.5), rgba(24, 139, 217, 0));
      opacity: 1;
    }
  }
}
</style>