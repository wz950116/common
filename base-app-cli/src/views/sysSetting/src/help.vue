<template>
  <div class="sys-setting-help basePage">
    <div class="title">热门问题</div>
    <div class="sub-title" v-for="item in list" :key="item.name" :title="item.name" @click="toDetail(item)">
      {{ item.name }}
    </div>
  </div>
</template>

<script setup>
/* eslint-disable no-unused-vars */
import { ref, reactive, onMounted } from 'vue'
import { useRouter } from '@/utils/vueApi'

onMounted(() => {
  router = useRouter()
})

let router = ref(null)
const list = ref([{
  name: '如何登记入库商户并完成审核确认？',
  content: [{
    desc: '打开app进入首页页面，点击商户管理模块。',
    img: '1.png'
  }, {
    desc: '可查看当前所有的商户信息，点击新增按钮进行商户登记。',
    img: '2.png'
  }, {
    desc: '点击新增后，进入商户登记页面，按照要求输入商户详细信息。然后点击确认。',
    img: '3.png'
  }, {
    desc: '点击保存后，商户录入成功，可返回已录入页面查看刚才录入的商户信息。',
    img: '4.png'
  }, {
    desc: '商户刚录入完成后，默认显示已录入状态，若要入库需要发起录入确认申请，点击商户详情后进入详情页面',
    img: '5.png'
  }, {
    desc: '进入商户详情后，可对当前商户进行申请确认。点击申请确认。',
    img: '6.png'
  }, {
    desc: '确认成功后，可进入已确认模块查看当前商户信息。',
    img: '7.png'
  }, {
    desc: '至此完成商户录入的入库操作。'
  }]
}, {
  name: '如何变更已入库商户信息？',
  content: [{
    desc: '首先进入商户管理页面',
    img: '8.png'
  }, {
    desc: '进入商户管理页面后，选择待确认或已经确认模块。',
    img: '9.png'
  }, {
    desc: '然后选择自己要变更的商户信息。进入商户详情后，点击变更。',
    img: '10.png'
  }, {
    desc: '变更完成后，可进入已变更模块查看当前商户信息。',
    img: '11.png'
  }]
}, {
  name: '如何作废已入库的商户？',
  content: [{
    desc: '首先进入商户管理页面',
    img: '12.png'
  }, {
    desc: '进入商户管理页面后，选择待确认或已经确认模块。',
    img: '13.png'
  }, {
    desc: '点击要作废的商户，进入商户详情页面',
    img: '14.png'
  }, {
    desc: '点击作废按钮，进行作废当前商户。',
    img: '15.png'
  }, {
    desc: '确定完成后，当前商户就进入作废模块了，可在选择已作废页面进行查看。',
    img: '16.png'
  }]
}, {
  name: '如何将已作废商户重新入库确认？',
  content: [{
    desc: '进入已作废的商户模块中，选择要重新入库的商户信息。',
    img: '17.png'
  }, {
    desc: '点击商户进入商户详情页面',
    img: '18.png'
  }, {
    desc: '在商户详情页面可点击恢复按钮，确定后即可完成商户信息的恢复。',
    img: '19.png'
  }, {
    desc: '商户恢复后，可进入已录入模块进行查看，若需要入库，则可通过前面的流程进行入库操作。',
    img: '20.png'
  }]
}, {
  name: '如何维护门前五包商户案件上报要求？',
  content: [{
    desc: '请通过PC端操作'
  }]
}, {
  name: '如何维护商户招牌类型？',
  content: [{
    desc: '请通过PC端操作'
  }]
}, {
  name: '如何为商户划定门前五包范围和职责？',
  content: [{
    desc: '请通过PC端操作'
  }]
}, {
  name: '如何受理和处置商户门前五包问题？',
  content: [{
    desc: '首先进入app页面，等待执法人员对商户问题进行上报，可通过门前五包上报 模块进行反馈商户问题，',
    img: '21.png'
  }, {
    desc: '点击进入门前五包上报页面，填写具体的信息后，点击上报。',
    img: '22.png'
  }, {
    desc: '上报成功后，执法人员将会受到门前五包对应的商户案件。执法人员可登录app，进入案件管理页面',
    img: '23.png'
  }, {
    desc: '点击案件管理，即可查看商户的门前五包问题，可进行受理和处置。',
    img: '24.png'
  }]
}, {
  name: '如何查看平台商户运行数据？',
  content: [{
    desc: '打开app进入首页页面，在门前五包业务下找到统计报表。',
    img: '25.png'
  }, {
    desc: '点击统计报表后，进入报表详情页面，可查看平台商户的所有运行数据。',
    img: '26.png'
  }]
}, {
  name: '如何查看系统访问和操作记录？',
  content: [{
    desc: '请通过PC端操作'
  }]
}, {
  name: '执法人员如何让商户完成问题自治？',
  content: [{
    desc: '执法人员登录app后，点击案件管理，可对商户问题进行处理。',
    img: '27.png'
  }, {
    desc: '点击案件管理后，进入至案件受理页面',
    img: '28.png'
  }, {
    desc: '所以上报的门前五包问题统一显示在案件受理模块。点击案件详情可对当前门前五包案件进行处理。',
    img: '29.png'
  }, {
    desc: '在案件详情页面中，点击操作，可通过商户自治将当前案件下派至商户端，进行处理。',
    img: '30.png'
  }, {
    desc: '进入商户自治后，商户可跟进执法要求进行处理，待商户处理完成后，执法人员在商户自治模块可查看当前案件的处理详情信息和流程，若满足则可结案完成商户自治。',
    img: '31.png'
  }, {
    desc: '点击完成结案后，即可结案当前商户案件。可在已归档中查看。',
    img: '32.png'
  }]
}, {
  name: '执法人员如何将商户案件派遣至数字城管处理？',
  content: [{
    desc: '执法人员在收到商户上报的案件后，可在案件受理模块查看。',
    img: '33.png'
  }, {
    desc: '点击要处理的案件进入案件操作详情页面',
    img: '34.png'
  }, {
    desc: '点击操作后，可选择商户自治或数字城管。',
    img: '35.png'
  }, {
    desc: '点击数字城管即可按要求提交至数字城管系统进行执法处理。',
    img: '36.png'
  }, {
    desc: '若数据城管处理完成后。可在已归档中查看当前案件。',
    img: '37.png'
  }, {
    desc: '查看执法详情后，可在操作模块查看当前案件在数字城管处理的具体情况。',
    img: '38.png'
  }]
}])

const toDetail = (item) => {
  router.push({
    name: 'sysSettingDetail',
    query: {
      item
    }
  })
}
</script>

<style lang="scss" scoped>
.sys-setting-help {
  height: calc(100vh - 56px);
  background: #ffffff;
  margin-top: 12px;
  padding: 0 16px;
  overflow: auto;
  .title {
    font-size: 18px;
    color: #333333;
    line-height: 54px;
    border-bottom: 1px solid #ebebeb;
  }
  .sub-title {
    font-size: 16px;
    color: #333333;
    line-height: 52px;
    border-bottom: 1px solid #ebebeb;
  }
}
</style>
