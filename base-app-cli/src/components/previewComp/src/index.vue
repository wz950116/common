<!--
 * @Author: fastfan
 * @Date: 2023-06-15 15:17:42
 * @LastEditors: fastfan
 * @LastEditTime: 2023-06-15 16:41:05
 * @Description: your description
-->
<template>
  <div style="margin-top: 46px">
    <vue-office-docx
      v-if="urlType === 'docx'"
      :src="url"
      @rendered="rendered"
    />
    <vue-office-excel
      v-if="urlType === 'xls' || urlType === 'xlsx'"
      :src="url"
      @rendered="rendered"
    />
    <vue-office-pdf
      v-if="urlType === 'pdf' || urlType === 'ppt'"
      :src="url"
      @rendered="rendered"
    />
    <van-image
      v-if="['png', 'jpg', 'jpeg'].includes(urlType)"
      width="100%"
      height="100%"
      :src="url"
    />
  </div>
</template>

<script>
// 引入VueOfficeDocx组件
import VueOfficeDocx from '@vue-office/docx'
// 引入VueOfficeExcel组件
import VueOfficeExcel from '@vue-office/excel'
// 引入VueOfficePdf组件
import VueOfficePdf from '@vue-office/pdf'

export default {
  components: {
    VueOfficeDocx,
    VueOfficeExcel,
    VueOfficePdf
  },
  props: {
    url: {
      type: String
    },
    urlType: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      // docx: 'http://static.shanhuxueyuan.com/test6.docx' // 设置文档地址
      // pdf: 'https://bj.bcebos.com/v1/wz950116/cci-map 统一服务规范.pdf' // 设置文档地址
    }
  },
  methods: {
    rendered() {
      console.log('渲染完成')
      console.log('this.urlType::::', this.urlType)
    }
  }
}
</script>
<style lang="scss">
.docx-wrapper {
  padding: 0 !important;
  section.docx {
    width: 100% !important;
    padding: 0 !important;
  }
}
.vue-office-pdf-wrapper {
  padding: 0 !important;
}
</style>
