<template>
  <div class="preview-wrap" :class="mark">
    <!-- docx -->
    <div v-html="wordHtml"></div>
    <!-- doc -->
    <!-- <iframe class="doc-frame" :src='docFramePreviewUrl' width='100%' height="100%"></iframe> -->
  </div>
</template>

<script>
// word预览，只支持docx
import mammoth from 'mammoth'
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
      // doc文件预览地址
      docFramePreviewUrl: '',
      // doc文件服务地址
      webUrl: 'https://view.xdocin.com/view?toolbar=false&src='
    }
  },
  mounted() {
    this.getDocx()
  },
  methods: {
    // 获取doc
    getDoc() {
      console.log('doc')
      this.docFramePreviewUrl = this.webUrl + this.url
    },
    // 获取docx
    getDocx() {
      console.log('docx')
      let _this = this
      const xhr = new XMLHttpRequest()
      xhr.open('post', '/workbench/workbenchFile/getFileBlob', true)
      xhr.setRequestHeader('content-type', 'application/json')
      xhr.responseType = 'arraybuffer'
      xhr.onload = function () {
        if (xhr.status === 200) {
          mammoth
            .convertToHtml({ arrayBuffer: new Uint8Array(xhr.response) })
            .then(function (resultObject) {
              _this.$nextTick(() => {
                _this.wordHtml = resultObject.value
              })
            })
            .catch((err) => {
              console.log(err, 'err')
            })
        }
      }
      xhr.send(JSON.stringify(this.data))
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
