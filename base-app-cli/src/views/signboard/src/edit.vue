<template>
  <div class="signboard-edit basePage">
    <my-form ref="form" :formOptions="formOptions" :fillData="fillData">
      <template #area>
        <cmb-field
          v-model="state.fieldValue"
          input-align="right"
          readonly
          label="所属区域"
          right-icon="arrow"
          required
          placeholder="请选择所属区域"
          @click="state.areaShow = true"
        />
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
      <div class="default" @click="onCancel">取消</div>
      <div class="primary" @click="onSave">保存</div>
    </div>
  </div>
</template>

<script setup>
/* eslint-disable no-unused-vars */
import { ref, reactive, onMounted, onActivated } from 'vue'
import myForm from '@/components/myForm'
import { fileUpload, queryEnumByEnumType, queryCityCommunity } from '@/api'
import { Toast, Dialog } from '@cci/mcui'
import { useRoute, useRouter } from '@/utils/vueApi'
import { findStoreSignManageById, createStoreSignManage, updateStoreSignManage, findStoreSignConfigComboBox } from '../store'
import { findListByRegion } from '../../merchant/store'
import { mutations } from '@/directive/keepAlive'
const route = useRoute()
const router = useRouter()

onMounted(() => {
  findStoreSignConfigComboBox().then(({ data, success }) => {
    if (success) {
      formOptions.value[0].formItems[2].list = data
    }
  })
  queryEnumByEnumType('DANGER_LEVEL').then(({ data, success }) => {
    if (success) {
      formOptions.value[0].formItems[3].list = data
    }
  })
  queryCityCommunity({ type: 'district' }).then(({ data, success }) => {
    if (success) {
      state.options = data.map(v => {
        return {
          ...v,
          children: []
        }
      })
    }
  })
  // 修改状态
  state.id = route.query?.id
  if (state.id) initData()
})

const state = reactive({
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
const currentAddress = ref({})
const formOptions = ref([
  {
    formItems: [
      {
        type: 'slotAll',
        slotName: 'area',
        label: '所属区域',
        placeholder: '请选择'
      },
      {
        type: 'select',
        prop: 'storeId',
        label: '商户名称',
        placeholder: '',
        list: [],
        optionName: 'storeInfo',
        optionKey: 'id'
      },
      {
        type: 'select',
        prop: 'signTypeId',
        label: '招牌类型',
        placeholder: '',
        list: [],
        optionName: 'name',
        optionKey: 'id'
      },
      {
        type: 'select',
        prop: 'dangerLevel',
        label: '隐患等级',
        placeholder: '',
        list: [],
        optionName: 'codeDesc',
        optionKey: 'codeValue'
      },
      {
        type: 'input',
        prop: 'signLength',
        label: '招牌长度(cm)',
        placeholder: '',
        maxlength: 30
      },
      {
        type: 'input',
        prop: 'signWide',
        label: '招牌宽度(cm)',
        placeholder: '',
        maxlength: 30
      },
      {
        type: 'input',
        prop: 'signHeight',
        label: '招牌高度(cm)',
        placeholder: '',
        maxlength: 30
      },
      {
        type: 'input',
        prop: 'signMaterial',
        label: '招牌材质',
        placeholder: '',
        maxlength: 100
      },
      {
        type: 'input',
        prop: 'signLocation',
        label: '招牌位置',
        placeholder: '',
        maxlength: 100
      },
      {
        label: '招牌照片',
        prop: 'signPhotoPaths',
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
  findStoreSignManageById({ storeSignManageId: state.id }).then(({ data, success }) => {
    if (success) {
      if (data.signPhotoPaths) {
        data.signPhotoPaths = data.signPhotoPaths.map(v => {
          return {
            ...v,
            filePath: v.path
          }
        })
      }
      findListByRegion({
        districtCode: data.districtCode,
        streetCode: data.streetCode,
        communityCode: data.communityCode
      }).then((res) => {
        if (res.success) {
          formOptions.value[0].formItems[1].list = res.data
          fillData.value = [data]
        }
      })
      state.fieldValue = data.areaInfo
    }
  })
}
// 打开地图
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
// 区域级联选择器变化
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
        selectedOptions.slice(-1)[0].children = data.map(v => {
          return {
            ...v,
            ...type !== 'village' && { children: [] }
          }
        })
      }
    })
  }
}
// 确认区域
const onFinish = ({ selectedOptions }) => {
  state.areaShow = false
  state.fieldValue = selectedOptions.map((option) => option[state.fieldNames.text]).join('')
  findListByRegion({
    districtCode: selectedOptions[0].cityCommunityId,
    streetCode: selectedOptions[1].cityCommunityId,
    communityCode: selectedOptions[2].cityCommunityId
  }).then(({ data, success }) => {
    if (success) {
      formOptions.value[0].formItems[1].list = data
    }
  })
}
// 保存
const onSave = async() => {
  const res = await form.value.returnValue()
  const params = {
    ...res[0]
  }
  params.signPhoto = params.signPhotoPaths?.map(v => v.id).join(',')
  if (!params.signPhoto.length) {
    Toast.fail('请上传照片')
    return
  }
  Dialog.confirm({
    title: '提示',
    message: '是否确认保存？'
  })
  .then(() => {
    if (state.id) {
      params.id = state.id
      updateStoreSignManage(params).then(({ success }) => {
        if (success) {
          // 清除keepAlive缓存
          mutations.delPageName('signboardEdit')
          Toast.success('修改成功')
          router.back()
        }
      })
    } else {
      createStoreSignManage(params).then(({ success }) => {
        if (success) {
          // 清除keepAlive缓存
          mutations.delPageName('signboardEdit')
          Toast.success('保存成功')
          router.back()
        }
      })
    }
  })
}
// 取消
const onCancel = () => {
  router.back()
}
</script>

<script>
export default {
  name: 'signboardEdit'
}
</script>

<style lang="scss" scoped>
.signboard-edit {
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
