<template>
  <div id="app">
    <cmb-nav ref="nav" />
    <keep-alive :include="pageName">
      <router-view />
    </keep-alive>
  </div>
</template>

<script>
import { state, mutations } from './directive/keepAlive'
export default {
  provide() {
    return {
      appRefs: this.$refs
    }
  },
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
  height: 100vh;
  background: #F7FAFB;
  overflow: hidden;
}
</style>
