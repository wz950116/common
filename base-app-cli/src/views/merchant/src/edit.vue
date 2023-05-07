<template>
  <div class="merchant-edit basePage">
    <my-form
      ref="form"
      :formOptions="formOptions"
      :fillData="fillData"
    >
      <template #zb="{ formData, panelIndex }">
        <div class="flex-hs" @click="selectMap(formData[panelIndex].longitude, formData[panelIndex].latitude)">
          <div :style="{ color: !formData[panelIndex].address ? '#BFBFBF' : '#666666' }">
            {{ formData[panelIndex].address || '地图上点击选择' }}
          </div>
          <cmb-icon class="loction_icon" name="location" />
        </div>
      </template>
    </my-form>
    <div class="button-list">
      <div class="default" @click="onCancel">取消</div>
      <div class="primary" @click="onSave">保存</div>
    </div>
  </div>
</template>

<script setup>
/* eslint-disable no-unused-vars */
import { ref, reactive, onMounted, onActivated } from 'vue'
import { useRoute, useRouter } from '@/utils/vueApi'
import myForm from '@/components/myForm'
import { fileUpload, queryEnumByEnumType } from '@/api'
import { Toast, Dialog } from '@cci/mcui'
import { findStoreBaseById, createStoreBase, updateStoreBase, changeStoreBase, confirmStoreBase } from '../store'
import { mutations } from '@/directive/keepAlive'
const route = useRoute()
const router = useRouter()

onMounted(() => {
  queryEnumByEnumType('STORE_TYPE').then(({ data, success }) => {
    if (success) {
      formOptions.value[0].formItems[3].list = data
    }
  })
  queryEnumByEnumType('OPERATION_STATUS').then(({ data, success }) => {
    if (success) {
      formOptions.value[0].formItems[4].list = data
    }
  })
  queryEnumByEnumType('CERT_TYPE').then(({ data, success }) => {
    if (success) {
      formOptions.value[0].formItems[7].list = data
    }
  })
  // 修改状态
  state.id = route.query?.id
  if (state.id) initData()
})

onActivated(() => {
  if (subRouter.value.query) {
    const { longitude, latitude, addressComponent } = subRouter.value?.query
    form.value.formData[0].longitude = longitude
    form.value.formData[0].latitude = latitude
    if (addressComponent) {
      const { address, area, areaCode, street, streetCode, communityName, communityCode } = addressComponent
      form.value.formData[0].address = address
      form.value.formData[0].district = area
      form.value.formData[0].districtCode = areaCode
      form.value.formData[0].street = street
      form.value.formData[0].streetCode = streetCode
      form.value.formData[0].community = communityName
      form.value.formData[0].communityCode = communityCode
      form.value.formData[0].areaInfo = area + street + communityName
    }
  }
})

const state = reactive({
  id: ''
})
const subRouter = ref({})
const form = ref()
const fillData = ref([])
const formOptions = ref([
  {
    formItems: [
      {
        type: 'input',
        prop: 'storeName',
        label: '商户名称',
        placeholder: '',
        maxlength: 100
      },
      {
        type: 'input',
        prop: 'uniformCreditCode',
        label: '统一社会信用代码',
        placeholder: '',
        maxlength: 100
      },
      {
        type: 'input',
        prop: 'legalRepresentative',
        label: '法定代表人',
        placeholder: '',
        maxlength: 100
      },
      {
        type: 'select',
        prop: 'storeType',
        label: '经营类型',
        placeholder: '',
        list: [],
        optionName: 'codeDesc',
        optionKey: 'codeValue'
      },
      {
        type: 'select',
        prop: 'operationStatus',
        label: '经营状态',
        placeholder: '',
        list: [],
        optionName: 'codeDesc',
        optionKey: 'codeValue'
      },
      {
        type: 'input',
        prop: 'principal',
        label: '负责人',
        placeholder: '',
        maxlength: 30
      },
      {
        type: 'input',
        prop: 'principalTel',
        label: '联系电话',
        placeholder: '',
        maxlength: 30
      },
      {
        type: 'select',
        prop: 'principalIdType',
        label: '负责人证件类型',
        placeholder: '',
        list: [],
        optionName: 'codeDesc',
        optionKey: 'codeValue'
      },
      {
        type: 'input',
        prop: 'principalIdCode',
        label: '负责人证件号',
        placeholder: '',
        maxlength: 100
      },
      {
        type: 'input',
        prop: 'areaInfo',
        label: '所属区域',
        placeholder: '选择点位后自动填充',
        attrs: {
          readonly: true
        }
      },
      {
        type: 'slot',
        slotName: 'zb',
        prop: 'address',
        label: '商户地址',
        placeholder: '打开地图选择位置',
        align: 'right',
        required: false
      },
      // 不显示参数
      {
        prop: 'longitude'
      },
      {
        prop: 'latitude'
      },
      {
        prop: 'street'
      },
      {
        prop: 'streetCode'
      },
      {
        prop: 'community'
      },
      {
        prop: 'communityCode'
      },
      {
        label: '营业执照',
        prop: 'storeLicensePaths',
        type: 'upload',
        align: 'left',
        labelPosition: 'top',
        requestApi: fileUpload,
        maxCount: 5
      },
      {
        label: '负责人证件照',
        prop: 'principalPhotoPaths',
        type: 'upload',
        align: 'left',
        labelPosition: 'top',
        requestApi: fileUpload,
        maxCount: 5
      },
      {
        label: '商户照片',
        prop: 'storePhotoPaths',
        type: 'upload',
        align: 'left',
        labelPosition: 'top',
        requestApi: fileUpload,
        maxCount: 5
      }
    ]
  }
])

const initData = () => {
  findStoreBaseById({ storeBaseId: state.id }).then(({ data, success }) => {
    if (success) {
      if (data.storeLicensePaths) {
        data.storeLicensePaths = data.storeLicensePaths.map(v => {
          return {
            ...v,
            filePath: v.path
          }
        })
      }
      if (data.principalPhotoPaths) {
        data.principalPhotoPaths = data.principalPhotoPaths.map(v => {
          return {
            ...v,
            filePath: v.path
          }
        })
      }
      if (data.storePhotoPaths) {
        data.storePhotoPaths = data.storePhotoPaths.map(v => {
          return {
            ...v,
            filePath: v.path
          }
        })
      }
      fillData.value = [data]
    }
  })
}
const selectMap = (lng, lat) => {
  router.push({
    path: '/selectMap',
    query: {
      longitude: lng,
      latitude: lat,
      type: 'click'
    }
  }).then(res => {
    subRouter.value = res
  })
}
const onSave = async() => {
  const res = await form.value.returnValue()
  const params = {
    ...res[0]
  }
  params.storeLicense = params.storeLicensePaths?.map(v => v.id).join(',')
  params.principalPhoto = params.principalPhotoPaths?.map(v => v.id).join(',')
  params.storePhoto = params.storePhotoPaths?.map(v => v.id).join(',')
  if (!params.storeLicense.length || !params.principalPhoto.length || !params.storePhoto.length) {
    Toast.fail('请上传照片')
    return
  }
  Dialog.confirm({
    title: '提示',
    message: '是否确认保存？'
  })
  .then(() => {
    if (state.id) {
      const httpType = route.query.type
      if (httpType === 'confirm') {
        confirmStoreBase({
          ...params,
          id: state.id,
          status: 2
        }).then(({ success }) => {
          if (success) {
            // 清除keepAlive缓存
            mutations.delPageName('merchantEdit')
            Toast.success('确认成功')
            router.push('/merchant')
          }
        })
      } else if (httpType === 'change') {
        changeStoreBase({
          ...params,
          id: state.id,
          status: 3
        }).then(({ success }) => {
          if (success) {
            // 清除keepAlive缓存
            mutations.delPageName('merchantEdit')
            Toast.success('变更成功')
            router.push('/merchant')
          }
        })
      } else {
        params.id = state.id
        updateStoreBase(params).then(({ success }) => {
          if (success) {
            // 清除keepAlive缓存
            mutations.delPageName('merchantEdit')
            Toast.success('修改成功')
            router.back()
          }
        })
      }
    } else {
      createStoreBase(params).then(({ success }) => {
        if (success) {
          // 清除keepAlive缓存
          mutations.delPageName('merchantEdit')
          Toast.success('保存成功')
          router.back()
        }
      })
    }
  })
}
const onCancel = () => {
  router.back()
}
</script>

<script>
export default {
  name: 'merchantEdit'
}
</script>

<style lang="scss" scoped>
.merchant-edit {
  height: calc(100vh - 46px);
  overflow: auto;
  .button-list {
    display: flex;
    justify-content: space-evenly;
    padding: 24px 0;

    & > div {
      width: 160px;
      height: 48px;
      line-height: 48px;
      text-align: center;
      font-size: 18px;
      border-radius: 4px;
    }

    .default {
      background: #ffffff;
      color: #262626;
      border: 1px solid #e6e6e6;
    }

    .primary {
      background: #3177ec;
      color: #ffffff;
    }
  }
}
</style>
