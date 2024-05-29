<template>
  <div class="home">
    <div class="border-1"></div>
    <div class="container">
      <router-link :to="{ name: 'report' }">
        门前五包上报
      </router-link>
      <router-link :to="{ name: 'merchant' }">
        商户信息
      </router-link>
      <router-link :to="{ name: 'signboard' }">
        店牌店招
      </router-link>
      <router-link :to="{ name: 'mapLook' }">
        地图浏览
      </router-link>
      <router-link :to="{ name: 'statistics' }">
        统计报表
      </router-link>
      <router-link :to="{ name: 'sysSetting' }">
        系统设置
      </router-link>
      <router-link :to="{ name: 'case' }">
        案件管理
      </router-link>
    </div>
  </div>
</template>

<script>
import { isDevMode } from '@/utils'
import { mutations } from '@/directive/keepAlive'
export default {
  name: 'home',
  mounted() {
    mutations.clearPageName()
    console.log(isDevMode, process.env.NODE_ENV, 'env', window.cci, this.$cci)
    if (!isDevMode) {
      // 这个方法目前貌似无效
      this.$cci.exit()
    }
  }
}
</script>

<style lang="less">
.home {
  .border-1 {
    width: 200px;
    height: 200px;
    border: 1px solid;
  }
  .container {
    display: flex;
    flex-wrap: wrap;
    padding: 0 20px;
    margin-left: -16px;
    a {
      display: block;
      width: calc(50% - 16px);
      height: 100px;
      flex-shrink: 0;
      box-shadow: 0 0 8px #ddd;
      margin-top: 16px;
      margin-left: 16px;
      font-size: 18px;
      color: #fff;
      text-align: center;
      line-height: 100px;
      background-color: @blue;
      border-radius: 10px;

      &.success {
        background-color: #01c1a3;
      }
    }
  }
}
</style>
