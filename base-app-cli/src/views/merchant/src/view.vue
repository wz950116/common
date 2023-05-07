<template>
  <div class="merchant-view basePage">
    <cellGroup :data="state.initData">
      <template #map>
        <div class="map-wrapper">
          <map-com ref="map" @mapInit="mapInit"></map-com>
        </div>
      </template>
    </cellGroup>
    <div class="button-list">
      <div v-if="[0].includes(state.formData.status)" class="default" @click="onEdit">修改</div>
      <div v-if="[0, 1, 3].includes(state.formData.status)" class="default" @click="onCancel">作废</div>
      <div v-if="[0, 3].includes(state.formData.status)" class="primary" @click="onApply">申请确认</div>
      <div v-if="[4].includes(state.formData.status)" class="default" @click="onResume">恢复</div>
      <div v-if="[2].includes(state.formData.status)" class="default" @click="onChange">变更</div>
      <div v-if="[1].includes(state.formData.status)" class="primary" @click="onConfirm">确认</div>
    </div>
  </div>
</template>

<script setup>
/* eslint-disable no-unused-vars */
import { ref, reactive, onMounted } from 'vue'
import { useRoute, useRouter } from '@/utils/vueApi'
import { findStoreBaseById, cancelStoreBase, applyConfirmStoreBase, restoreStoreBase } from '../store'
import { Toast, Dialog } from '@cci/mcui'
import MapCom from '@/components/map'
import cellGroup from '@/components/cellGroup'

onMounted(() => {
  route = useRoute()
  router = useRouter()
  state.id = route.query?.id
  initData()
})

const map = ref()
let route = ref(null)
let router = ref(null)
const state = reactive({
  id: '',
  map: null,
  formData: {},
  initData: [
    {
      text: '商户名称',
      value: '',
      key: 'storeName'
    },
    {
      text: '法定代表人',
      value: '',
      key: 'legalRepresentative'
    },
    {
      text: '统一社会信用代码',
      value: '',
      key: 'uniformCreditCode'
    },
    {
      text: '经营类型',
      value: '',
      key: 'storeTypeDesc'
    },
    {
      text: '经营状态',
      value: '',
      key: 'operationStatusDesc'
    },
    {
      text: '负责人',
      value: '',
      key: 'principal'
    },
    {
      text: '联系电话',
      value: '',
      key: 'principalTel'
    },
    {
      text: '负责人证件类型',
      value: '',
      key: 'principalIdTypeDesc'
    },
    {
      text: '负责人证件号',
      value: '',
      key: 'principalIdCode'
    },
    {
      text: '所属区域',
      value: '',
      key: 'areaInfo'
    },
    {
      text: '商户地址',
      value: '',
      key: 'address',
      label: '',
      labelShow: true
    },
    {
      slotName: 'map',
      text: '位置',
      value: '',
      key: '',
      label: '',
      labelShow: true
    },
    {
      text: '营业执照',
      value: '',
      key: 'storeLicensePaths',
      label: '',
      labelShow: true
    },
    {
      text: '负责人证件照',
      value: '',
      key: 'principalPhotoPaths',
      label: '',
      labelShow: true
    },
    {
      text: '商户照片',
      value: '',
      key: 'storePhotoPaths',
      label: '',
      labelShow: true
    },
    {
      text: '二维码',
      value: '',
      key: 'qrCodePaths',
      label: '',
      labelShow: true
    },
    {
      text: '创建时间',
      value: '',
      key: 'createTime'
    },
    {
      text: '更新时间',
      value: '',
      key: 'updateTime'
    }
  ]
})

const initData = () => {
  findStoreBaseById({ storeBaseId: state.id }).then(({ data, success }) => {
    if (success) {
      state.formData = data
      state.initData.forEach((item) => {
        if (item.text === '商户名称') {
          item.value = data[item.key] + '(' + data.statusDesc + ')'
        } else {
          if (item.labelShow) {
            item.label = data[item.key]
          } else {
            item.value = data[item.key]
          }
        }
      })
    }
  })
}
const mapInit = (map) => {
  state.map = map
  onMarker(state.formData.longitude, state.formData.latitude)
}
const onMarker = (lng, lat) => {
  if (lng && lat) {
    // 创建点位
    map.value.setZoomAndCenter({ lat, lng })
    map.value.createAndAddMarker({
      points: [{ latitude: lat, longitude: lng }],
      iconUrl: require('@/assets/images/point.png')
    })
  }
}
// 修改
const onEdit = () => {
  router.push({
    path: '/merchant/edit',
    query: {
      id: state.id
    }
  })
}
// 作废
const onCancel = () => {
  Dialog.confirm({
    title: '提示',
    message: '是否确认废弃该商户？'
  })
  .then(() => {
    cancelStoreBase({
      id: state.id,
      status: 4
    }).then(({ success }) => {
      if (success) {
        Toast.success('作废成功')
        router.back()
      }
    })
  })
}
// 确认
const onConfirm = () => {
  router.push({
    path: '/merchant/edit',
    query: {
      id: state.id,
      type: 'confirm'
    }
  })
}
// 恢复
const onResume = () => {
  Dialog.confirm({
    title: '提示',
    message: '是否恢复该商户？'
  })
  .then(() => {
    restoreStoreBase({
      id: state.id,
      status: 0
    }).then(({ success }) => {
      if (success) {
        Toast.success('恢复成功')
        router.back()
      }
    })
  })
}
// 变更
const onChange = () => {
  router.push({
    path: '/merchant/edit',
    query: {
      id: state.id,
      type: 'change'
    }
  })
}
// 申请确认
const onApply = () => {
  Dialog.confirm({
    title: '提示',
    message: '是否申请确认该商户？'
  })
  .then(() => {
    applyConfirmStoreBase({
      id: state.id,
      status: 1
    }).then(({ success }) => {
      if (success) {
        Toast.success('申请确认成功')
        router.back()
      }
    })
  })
}
</script>

<style lang="scss" scoped>
.merchant-view {
  height: calc(100vh - 46px);
  overflow: auto;
  .map-wrapper {
    width: 343px;
    height: 200px;
  }
  .button-list {
    display: flex;
    padding: 24px 0;

    & > div {
      width: 100%;
      height: 44px;
      line-height: 44px;
      text-align: center;
      font-size: 18px;
      border-radius: 8px;
      border: 1px solid #0482ff;
      margin: 0 12px;
    }

    .default {
      background: #ffffff;
      color: #0482ff;
    }

    .primary {
      background: #3177ec;
      color: #ffffff;
    }
  }
}
</style>
