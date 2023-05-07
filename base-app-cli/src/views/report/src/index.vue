<template>
  <div class="merchant-edit basePage">
    <my-form ref="form" :formOptions="formOptions" :fillData="fillData">
      <template #zb="{ formData, panelIndex }">
        <div class="flex-hs" @click="selectMap(formData[panelIndex].longitude, formData[panelIndex].latitude)">
          <div :style="{ color: !formData[panelIndex].address ? '#BFBFBF' : '#666666' }">
            {{ formData[panelIndex].address || '地图上点击选择' }}
          </div>
          <cmb-icon class="loction_icon" name="location" />
        </div>
      </template>
      <template #storeName>
        <field-picker v-model="state.storeName" label="五包商户" valueKey="storeInfo" code="id" opType="edit" :columns="state.storeList" columns-top placeholder="" required @changeall="onChange">
          <cmb-search slot="columnsTop" v-model="state.searchKey" placeholder="请输入搜索关键词" @input="onSearch" />
        </field-picker>
      </template>
    </my-form>
    <div class="button-list">
      <div class="primary" @click="onSubmit">上报</div>
    </div>
  </div>
</template>

<script setup>
/* eslint-disable no-unused-vars */
import { ref, reactive, onMounted, onActivated } from 'vue'
import myForm from '@/components/myForm'
import { fileUpload } from '@/api'
import { Toast } from '@cci/mcui'
import FieldPicker from '@/components/FieldPicker'
import { useRoute, useRouter } from '@/utils/vueApi'
import { createStoreCase, getStoreManageTypeComboBox, findByManagerTypeCode, findByCategoryCode, findListByStoreName } from '../store'
const route = useRoute()
const router = useRouter()

onMounted(() => {
  getStoreManageTypeComboBox().then(({ data, success }) => {
    if (success) {
      state.manageTypeList = data || []
      formOptions.value[0].formItems[2].list = state.manageTypeList
    }
  })
})

onActivated(() => {
  if (subRouter.value.query && subRouter.value.query.type !== 'readonly') {
    const { longitude, latitude, addressComponent } = subRouter.value?.query
    form.value.formData[0].longitude = longitude
    form.value.formData[0].latitude = latitude
    if (addressComponent) {
      form.value.formData[0].address = addressComponent.address
    }
  } else {
    onReset()
  }
})

const state = reactive({
  manageTypeList: [],
  codeList: [],
  showPicker: false,
  searchKey: '',
  storeName: '',
  storeList: [],
  categoryList: []
})
const subRouter = ref({})
const form = ref()
const fillData = ref([])
const formOptions = ref([
  {
    formItems: [
      {
        label: '照片/视频',
        prop: 'fileIds',
        type: 'upload',
        align: 'left',
        labelPosition: 'top',
        requestApi: fileUpload,
        accept: 'video/*,image/*'
      },
      {
        type: 'textarea',
        prop: 'caseDesc',
        label: '问题描述',
        placeholder: '',
        maxlength: 500,
        labelPosition: 'top',
        align: 'left',
        showSound: true
      },
      {
        type: 'select',
        prop: 'manageTypeCode',
        label: '门前五包类型',
        placeholder: '',
        list: [],
        optionName: 'name',
        optionKey: 'code',
        cb: (val, formData) => manageTypeChange(val, formData)
      },
      {
        type: 'select',
        prop: 'code',
        label: '问题类型',
        placeholder: '',
        list: [],
        optionName: 'name',
        optionKey: 'code',
        cb: (val, formData) => codeChange(val, formData)
      },
      {
        type: 'select',
        prop: 'acceptStandard',
        label: '立案条件',
        placeholder: '',
        list: [],
        optionName: 'acceptStandard',
        optionKey: 'acceptStandard',
        cb: (val, formData) => acceptStandardChange(val, formData)
      },
      {
        type: 'input',
        prop: 'closeStandard',
        label: '结案条件',
        placeholder: '',
        attrs: {
          readonly: true
        }
      },
      {
        type: 'slot',
        slotName: 'zb',
        prop: 'address',
        label: '地址描述',
        placeholder: '',
        align: 'right',
        required: true
      },
      // 不显示参数
      {
        prop: 'longitude'
      },
      {
        prop: 'latitude'
      },
      {
        type: 'radioGroup',
        prop: 'isSupervise',
        label: '该案件是否为领导交办',
        defaultValue: '是',
        required: false,
        list: [
          {
            label: '是',
            value: 1
          },
          {
            label: '否',
            value: 0
          }
        ]
      },
      {
        type: 'slotAll',
        slotName: 'storeName',
        prop: 'storeName',
        label: '五包商户',
        placeholder: '请选择'
      }
    ]
  }
])

// 门前五包类型修改
const manageTypeChange = (val, formData) => {
  state.codeList = []
  formData.code = ''
  formData.acceptStandard = ''
  formData.closeStandard = ''
  const managerTypeCode = state.manageTypeList.find((v) => v.name === val)?.code
  findByManagerTypeCode({ managerTypeCode }).then(({ data, success }) => {
    if (success) {
      state.codeList = data || []
      formOptions.value[0].formItems[3].list = state.codeList
    }
  })
}
// 问题类型修改
const codeChange = (val, formData) => {
  formData.acceptStandard = ''
  formData.closeStandard = ''
  const categoryCode = state.codeList.find((v) => v.name === val)?.code
  findByCategoryCode({ categoryCode }).then(({ data, success }) => {
    if (success) {
      state.categoryList = data || []
      formOptions.value[0].formItems[4].list = state.categoryList
    }
  })
}
// 立案条件修改
const acceptStandardChange = (val, formData) => {
  formData.closeStandard = state.categoryList.find((v) => v.acceptStandard === val)?.closeStandard
}
// 打开地图
const selectMap = (lng, lat) => {
  router
    .push({
      path: '/selectMap',
      query: {
        longitude: lng,
        latitude: lat,
        type: 'click'
      }
    })
    .then((res) => {
      subRouter.value = res
    })
}
const selectStore = () => {
  const { longitude, latitude } = form.value.formData[0]
  if (longitude && latitude) {
    state.showPicker = true
  } else {
    Toast.fail('请先选择点位')
  }
}
const onChange = (val) => {
  console.log(val, 123)
  form.value.formData[0].storeId = val.id
}
const onSearch = (val) => {
  state.storeList = []
  const { longitude, latitude } = form.value.formData[0]
  findListByStoreName({
    longitude,
    latitude,
    storeName: val
  }).then(({ data, success }) => {
    if (success) {
      state.storeList = data || []
    }
  })
}
const onReset = () => {
  fillData.value = [
    {
      fileIds: '',
      caseDesc: '',
      manageTypeCode: '',
      code: '',
      acceptStandard: '',
      closeStandard: '',
      address: '',
      longitude: '',
      latitude: '',
      isSupervise: '是',
      storeId: ''
    }
  ]
  state.searchKey = ''
  state.storeName = ''
  form.value.file[0].fileIds = []
  form.value.$refs.formRef[0].resetValidation()
}
const onSubmit = async() => {
  const res = await form.value.returnValue()
  const params = {
    ...res[0]
  }
  params.fileIds = params.fileIds?.map((v) => v.id).join(',')
  if (!params.fileIds.length) {
    Toast.fail('请上传照片')
    return
  }
  createStoreCase(params).then(({ success }) => {
    if (success) {
      Toast.success('上报成功')
      subRouter.value = {}
      onReset()
      router.back()
    }
  })
}
</script>

<script>
export default {
  name: 'report'
}
</script>

<style lang="scss" scoped>
.merchant-edit {
  height: calc(100vh - 46px);
  overflow: auto;
  .button-list {
    display: flex;
    justify-content: space-evenly;
    padding: 35px 12px;

    & > div {
      width: 100%;
      height: 48px;
      line-height: 48px;
      text-align: center;
      font-size: 18px;
      border-radius: 4px;
    }

    .primary {
      background: #3177ec;
      color: #ffffff;
    }
  }
}
</style>
