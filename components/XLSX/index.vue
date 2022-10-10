<template>
  <div class="preview-wrap">
    <div v-html="excelHtml"></div>
  </div>
</template>

<script>
import XLSX from 'xlsx'
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
  data() {
    return {
      excelHtml: ''
    }
  },
  mounted() {
    this.getExcel()
  },
  methods: {
    // 获取excel
    getExcel() {
      let _this = this
      const xhr = new XMLHttpRequest()
      xhr.open('post', '/workbench/workbenchFile/getFileBlob', true)
      xhr.setRequestHeader('content-type', 'application/json')
      xhr.responseType = 'arraybuffer'
      xhr.onload = function () {
        if (xhr.status === 200) {
          let data = new Uint8Array(xhr.response)
          let workbook = XLSX.read(data, { type: 'array' })
          let sheetName = workbook.SheetNames
          let _html = ''
          // 遍历多个表
          for (let i in sheetName) {
            let sheet = workbook.Sheets[sheetName[i]]
            _html += XLSX.utils.sheet_to_html(sheet)
          }
          _this.$nextTick(() => {
            console.log(_this.excelHtml)
            _this.excelHtml = _html
          })
        }
      }
      xhr.send(JSON.stringify({}))
    }
  }
}
</script>
<style lang="scss" scoped>
  .preview-wrap {
    height: 100%;
    width: 100%;
    overflow-y: auto;
  }
</style>
