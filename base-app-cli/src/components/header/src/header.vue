<template>
  <div class="headerContainer">
    <cmb-nav-bar
      :title="title"
      :left-text="leftText"
      :right-text="rightText"
      left-arrow
      @click-left="clickLeft"
      @click-right="$emit('rightClick')"
      v-if="!isProd"
    >
      <template #left>
        <slot name="left" />
      </template>
      <template #title>
        <slot name="title" />
      </template>
      <template #right>
        <slot name="right" />
      </template>
    </cmb-nav-bar>
  </div>
</template>

<script>
import { mutations } from '@/directive/keepAlive'
export default {
  name: 'myHeader',
  props: {
    title: {
      type: String,
      default: () => '标题'
    },
    leftText: {
      type: String,
      default: () => ''
    },
    rightText: {
      type: String,
      default: () => ''
    }
  },
  data() {
    return {
      isProd: true
    }
  },
  mounted() {
    if (process.env.NODE_ENV !== 'production') {
      this.isProd = false
    }
  },
  methods: {
    clickLeft() {
      // 如果有监听左击事件 则不触发路由后退
      if (this.$listeners.leftClick) {
        this.$emit('leftClick')
      } else {
        mutations.delPageName(this.$route.name)
        this.$router.go(-1)
      }
    }
  }
}
</script>

<style lang='scss'>
.headerContainer {
  width: 100%;
  height: 46px;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
}
.van-nav-bar {
  .van-nav-bar__arrow {
    font-size: 22px;
  }
  .van-nav-bar__title {
    font-size: 18px;
  }
  .van-nav-bar__right {
    .van-nav-bar__text {
      font-size: 14px;
      font-weight: 400;
    }
  }
}
</style>
