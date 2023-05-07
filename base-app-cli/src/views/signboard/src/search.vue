<template>
  <cmb-dialog v-model="state.show" title="" width="95%" :show-confirm-button="false">
    <my-form ref="form" :formOptions="formOptions" :fillData="fillData"></my-form>
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
import { queryEnumByEnumType } from '@/api'
const emit = defineEmits(['openMethod'])
const route = useRoute()
const router = useRouter()

onMounted(async() => {
  // 经营类型
  const signData = await queryEnumByEnumType('SIGN_TYPE')
  formOptions.value[0].formItems[1].list = signData.data
  // 经营状态
  const dangerData = await queryEnumByEnumType('DANGER_LEVEL')
  formOptions.value[0].formItems[2].list = dangerData.data
  emit('openMethod', async(params) => {
    state.show = true
    // 回显表单
    nextTick(() => {
      fillData.value = [params]
    })
  })
})

const state = reactive({
  show: false
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
        type: 'select',
        prop: 'signTypeId',
        label: '招牌类型',
        placeholder: '',
        list: [],
        optionName: 'codeDesc',
        optionKey: 'codeValue',
        required: false
      },
      {
        type: 'select',
        prop: 'dangerLevel',
        label: '隐患等级',
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

// 保存
const onSave = async() => {
  const res = await form.value.returnValue()
  const params = {
    ...fillData.value[0],
    ...res[0]
  }
  emit('confirm', params)
  state.show = false
}
// 重置
const onReset = () => {
  form.value.formData[0] = {
    uniformCreditCode: '',
    signTypeId: '',
    dangerLevel: '',
    timeBegin: '',
    timeEnd: ''
  }
  // 调用组件内初始化form对象
  form.value.initForm()
}
</script>

<style lang="scss" scoped>
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
