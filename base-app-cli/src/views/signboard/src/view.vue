<template>
  <div class="signboard-view basePage">
    <cellGroup :data="state.initData"></cellGroup>
    <div class="button-list">
      <div class="default" @click="onCancel">作废</div>
      <div class="primary" @click="onEdit">修改</div>
    </div>
  </div>
</template>

<script setup>
/* eslint-disable no-unused-vars */
import { ref, reactive, onMounted } from 'vue'
import { useRoute, useRouter } from '@/utils/vueApi'
import { findStoreSignManageById, cancelStoreSignManage } from '../store'
import cellGroup from '@/components/cellGroup'
import { Toast, Dialog } from '@cci/mcui'

onMounted(() => {
  route = useRoute()
  router = useRouter()
  state.id = route.query?.id
  initData()
})

let route = ref(null)
let router = ref(null)
const state = reactive({
  id: '',
  initData: [
    {
      text: '商户名称',
      value: '',
      key: 'storeName'
    },
    {
      text: '统一社会信用代码',
      value: '',
      key: 'uniformCreditCode'
    },
    {
      text: '商户负责人',
      value: '',
      key: 'principal'
    },
    {
      text: '联系电话',
      value: '',
      key: 'principalTel'
    },
    {
      text: '所属区域',
      value: '',
      key: 'areaInfo'
    },
    {
      text: '招牌类型',
      value: '',
      key: 'signTypeName'
    },
    {
      text: '隐患等级',
      value: '',
      key: 'dangerLevelDesc'
    },
    {
      text: '招牌尺寸',
      value: '',
      key: ''
    },
    {
      text: '招牌材质',
      value: '',
      key: 'signMaterial'
    },
    {
      text: '招牌位置',
      value: '',
      key: 'signLocation'
    },
    {
      text: '招牌照片',
      value: '',
      key: 'signPhotoPaths',
      label: '',
      labelShow: true
    },
    {
      text: '在用状态',
      value: '',
      key: 'isOnDesc'
    },
    {
      text: '创建时间',
      value: '',
      key: 'createTime'
    }
  ]
})

const initData = () => {
  findStoreSignManageById({ storeSignManageId: state.id }).then(({ data, success }) => {
    if (success) {
      state.initData.forEach((item) => {
        if (item.text === '招牌尺寸') {
          item.value = data.signLength + ' * ' + data.signWide + ' * ' + data.signHeight + ' cm³ '
        } else if (item.labelShow) {
          item.label = data[item.key]
        } else {
          item.value = data[item.key]
        }
      })
    }
  })
}
const onEdit = () => {
  router.push({
    path: '/signboard/edit',
    query: {
      id: state.id
    }
  })
}
const onCancel = () => {
  Dialog.confirm({
    title: '提示',
    message: '是否确认废弃该商户的招牌信息？'
  })
  .then(() => {
    cancelStoreSignManage({
      id: state.id,
      isOn: 0
    }).then(({ success }) => {
      if (success) {
        Toast.success('作废成功')
        router.back()
      }
    })
  })
}
</script>

<style lang="scss" scoped>
.signboard-view {
  height: calc(100vh - 46px);
  overflow: auto;
  .list {
    .list-item-textarea {
      .van-cell__value {
        flex: 0;
      }
    }
    .pic-list {
      img {
        width: 72px;
        height: 72px;
        margin-right: 8px;
        border-radius: 4px;
      }
    }
  }
  .button-list {
    display: flex;
    justify-content: space-evenly;
    padding: 24px 0;

    & > div {
      width: 168px;
      height: 44px;
      line-height: 44px;
      text-align: center;
      font-size: 18px;
      border-radius: 8px;
      border: 1px solid #0482ff;
    }

    .default {
      background: #ffffff;
      color: #0482FF;
    }

    .primary {
      background: #3177ec;
      color: #ffffff;
    }
  }
}
</style>
