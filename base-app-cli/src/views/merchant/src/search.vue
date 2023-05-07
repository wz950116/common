<template>
  <cmb-dialog v-model="state.show" title="" width="95%" :show-confirm-button="false">
    <my-form class="my-form" ref="form" :formOptions="formOptions" :fillData="fillData">
      <template #area>
        <cmb-field v-model="state.fieldValue" input-align="right" readonly label="所属区域" right-icon="arrow" placeholder="请选择所属区域" @click="state.areaShow = true" />
        <cmb-popup v-model="state.areaShow" round position="bottom">
          <cmb-cascader
            v-model="state.cascaderValue"
            title="请选择所属区域"
            :options="state.options"
            :field-names="state.fieldNames"
            @close="state.areaShow = false"
            @change="onChange"
            @finish="onFinish"
          />
        </cmb-popup>
      </template>
    </my-form>
    <div class="button-list">
      <div class="default" @click="onReset">重置</div>
      <div class="primary" @click="onSave">查询</div>
    </div>
  </cmb-dialog>
</template>

<script setup>
/* eslint-disable no-unused-vars */
import { ref, reactive, onMounted, nextTick, defineEmits } from 'vue'
import { useRoute, useRouter } from '@/utils/vueApi'
import myForm from '@/components/myForm'
import { queryEnumByEnumType, queryCityCommunity } from '@/api'
const emit = defineEmits(['openMethod'])
const route = useRoute()
const router = useRouter()

onMounted(async() => {
  // 经营类型
  const storeData = await queryEnumByEnumType('STORE_TYPE')
  formOptions.value[0].formItems[2].list = storeData.data
  // 经营状态
  const operationData = await queryEnumByEnumType('OPERATION_STATUS')
  formOptions.value[0].formItems[3].list = operationData.data
  state.options = []
  emit('openMethod', async(params) => {
    // 所属区域
    const districtData = await queryCityCommunity({ type: 'district' })
    state.options = districtData.data.map((v) => {
      return {
        ...v,
        children: []
      }
    })
    state.show = true
    // 回显表单
    nextTick(() => {
      fillData.value = [params]
      state.fieldValue = fillData.value[0].areaInfo
    })
  })
})

const state = reactive({
  show: false,
  fieldValue: '',
  areaShow: false,
  options: [],
  fieldNames: {
    text: 'cityCommunityName',
    value: 'cityCommunityId'
  }
})
const subRouter = ref({})
const form = ref()
const fillData = ref([])
const formOptions = ref([
  {
    formItems: [
      {
        type: 'input',
        prop: 'uniformCreditCode',
        label: '统一社会信用代码',
        placeholder: '',
        maxlength: 100,
        required: false
      },
      {
        type: 'slotAll',
        prop: 'communityCode',
        slotName: 'area',
        label: '所属区域',
        placeholder: '请选择',
        required: false
      },
      {
        type: 'select',
        prop: 'storeType',
        label: '经营类型',
        placeholder: '',
        list: [],
        optionName: 'codeDesc',
        optionKey: 'codeValue',
        required: false
      },
      {
        type: 'select',
        prop: 'operationStatus',
        label: '经营状态',
        placeholder: '',
        list: [],
        optionName: 'codeDesc',
        optionKey: 'codeValue',
        required: false
      },
      {
        label: '创建开始时间',
        prop: 'timeBegin',
        type: 'dateTime',
        required: false,
        dateTimeType: 'datetime'
      },
      {
        label: '创建结束时间',
        prop: 'timeEnd',
        type: 'dateTime',
        required: false,
        dateTimeType: 'datetime'
      }
    ]
  }
])

const onChange = ({ selectedOptions, value }) => {
  let type = selectedOptions.slice(-1)[0].type
  if (type === 'district') {
    type = 'street'
  } else if (type === 'street') {
    type = 'village'
  } else if (type === 'village') {
    type = 'road'
  }
  if (type !== 'road') {
    queryCityCommunity({ type, communityParentId: value }).then(({ data, success }) => {
      if (success) {
        selectedOptions.slice(-1)[0].children = data.map((v) => {
          return {
            ...v,
            ...(type !== 'village' && { children: [] })
          }
        })
      }
    })
  }
}
const onFinish = ({ selectedOptions }) => {
  console.log(selectedOptions)
  state.areaShow = false
  state.fieldValue = selectedOptions.map((option) => option[state.fieldNames.text]).join('')
  form.value.formData[0].communityCode = selectedOptions.slice(-1)[0].cityCommunityId
}
// 保存
const onSave = async() => {
  const res = await form.value.returnValue()
  const params = {
    ...fillData.value[0],
    ...res[0],
    areaInfo: state.fieldValue
  }
  emit('confirm', params)
  state.show = false
}
// 重置
const onReset = () => {
  state.fieldValue = ''
  form.value.formData[0] = {
    uniformCreditCode: '',
    storeType: '',
    operationStatus: '',
    timeBegin: '',
    timeEnd: ''
  }
  form.value.initForm()
}
</script>

<style lang="scss" scoped>
.van-dialog {
  border-radius: 0;
}
.my-form {
  height: calc(100vh - 200px);
}
.button-list {
  display: flex;
  justify-content: space-evenly;
  padding: 12px 0;

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
</style>
