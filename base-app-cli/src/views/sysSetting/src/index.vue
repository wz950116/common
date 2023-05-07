<template>
  <div class="sys-setting basePage">
    <cmb-cell-group>
      <cmb-cell is-link @click="toHelp">
        <template #title>
          <img class="menu-icon" src="@/assets/images/help.png" alt="">
          <span class="custom-title">门前五包使用帮助</span>
        </template>
      </cmb-cell>
    </cmb-cell-group>
  </div>
</template>

<script setup>
/* eslint-disable no-unused-vars */
import { reactive, ref, onMounted } from 'vue'
import { Toast } from '@cci/mcui'
import { useRouter } from '@/utils/vueApi'

onMounted(() => {
  router = useRouter()
})

let router = ref(null)

const state = reactive({})

const toHelp = () => {
  console.log(111)
  router.push({
    name: 'sysSettingHelp'
  })
}
</script>

<style lang="scss" scoped>
.sys-setting {
  .menu-icon {
    width: 20px;
    height: 20px;
    vertical-align: top;
    margin-top: 2px;
    margin-right: 8px;
  }
}
</style>
