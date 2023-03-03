<template>
  <div class="preview-wrap">
    <pdf :src="pdfUrl" v-for="page in pdfPageCount" :key="page" :page="page" />
  </div>
</template>

<script>
// pdf预览插件
import pdf from 'vue-pdf'
// 文件流
// function fileBlob(data) {
//   return request({
//     url: '/workbench/workbenchFile/getFileBlob',
//     method: 'post',
//     data,
//     responseType: 'blob',
//     headers: {
//       'Content-Type': 'application/json'
//     }
//   })
// }
import { fileBlob } from '@/api/menhu'
export default {
  name: 'preview',
  props: {
    url: {
      type: String,
      required: true
    },
    name: {
      type: String,
      required: true
    }
  },
  components: {
    pdf
  },
  data() {
    return {
      pdfUrl: '',
      pdfPageCount: 0
    }
  },
  mounted() {
    this.getPdf()
  },
  methods: {
    // 获取pdf
    async getPdf() {
      const res = await fileBlob({})
      this.getPdfNumPages(res)
    },
    // 获取pdf的页数
    getPdfNumPages(currentUrl) {
      // 流数据转换url地址
      this.pdfUrl = window.webkitURL.createObjectURL(currentUrl)
      console.log(this.pdfUrl, 'this.pdfUrl')
      let loadingTask = pdf.createLoadingTask(this.pdfUrl)
      loadingTask.promise
        .then(pdf => {
          console.log(pdf)
          this.pdfPageCount = pdf.numPages
        })
        .catch(e => {
          console.log(e, 'error')
        })
    }
  }
}
</script>

<style lang="scss" scoped>
.preview-wrap {
  position: relative;
  height: 100%;
  width: 100%;
  overflow-y: auto;
}
</style>
