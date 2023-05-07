<template>
  <div class="sys-setting-detail basePage">
    <div class="title">{{ item.name }}</div>
    <div class="content" v-for="(i, index) in item.content" :key="index">
      <div class="sub-content">{{index + 1}}.{{ i.desc }}</div>
      <img v-if="i.img" class="sub-img" :src="require(`@/assets/images/sysSetting/${i.img}`)" alt="">
    </div>
  </div>
</template>

<script setup>
/* eslint-disable no-unused-vars */
import { ref, reactive, onMounted } from 'vue'
import { useRoute } from '@/utils/vueApi'
const route = useRoute()

onMounted(() => {
  item.value = route.query.item
})

const item = ref({})
</script>

<style lang="scss" scoped>
.sys-setting-detail {
  height: calc(100vh - 44px);
  padding: 16px;
  background: #ffffff;
  overflow: auto;
  .title {
    font-size: 16px;
    font-family: PingFang SC, PingFang SC-Medium;
    font-weight: 500;
    color: #333333;
    line-height: 24px;
    margin-bottom: 16px;
  }
  .content {
    font-size: 16px;
    font-family: PingFang SC, PingFang SC-Regular;
    font-weight: 400;
    line-height: 24px;
    margin-bottom: 16px;
    .sub-content {
      color: #666666;
      margin-bottom: 8px;
    }
    .sub-img {
      width: 100%;
    }
  }
}
</style>
