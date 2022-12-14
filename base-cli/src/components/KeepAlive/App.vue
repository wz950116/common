<template>
  <div id="app">
    <keep-alive :include="pageName">
      <router-view />
    </keep-alive>
  </div>
</template>

<script>
import { state, mutations } from './keepAlive'

export default {
  computed: {
    pageName() {
      return state.includes
    }
  },
  watch: {
    $route: {
      handler(n) {
        if (n.meta.keepAlive) {
          mutations.addPageName(n.name)
        }
      }
    }
  }
}
</script>

<style lang="scss">
#app {
  font-size: 14px;
  width: 100%;
  height: 100vh;
  overflow: hidden;
  background: #f2f4f7;
  font-family: PingFangSC, PingFangSC-Medium;
  * {
    box-sizing: border-box;
  }
}
</style>
