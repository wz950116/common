<template>
  <div class="tinymce-editor">
    <Editor ref="myEditor" :id="editorId" :init="editorInit" :disabled="disabled" @onClick="handleClick" />
  </div>
</template>

<script>
// npm install --save tinymce @tinymce/tinymce-vue
import request from '@/utils/request.js'
// 引入组件
import tinymce from 'tinymce/tinymce'
import Editor from '@tinymce/tinymce-vue'
// 引入富文本编辑器主题的js和css
import 'tinymce/themes/silver/theme.min.js'
import 'tinymce/skins/ui/oxide/skin.min.css'
// 扩展插件
import '/public/tinymce-dist/plugins/axupimgs'
import 'tinymce/plugins/image'
import 'tinymce/plugins/media'
import 'tinymce/plugins/link'
import 'tinymce/plugins/code'
import 'tinymce/plugins/table'
import 'tinymce/plugins/lists'
import 'tinymce/plugins/wordcount' // 字数统计插件
import 'tinymce/icons/default'
export default {
  name: 'TinymceEditor',
  components: { Editor },
  model: {
    prop: 'value',
    event: 'input'
  },
  props: {
    id: {
      type: String,
      default: 'tinymceEditor'
    },
    value: {
      type: String,
      default: ''
    },
    disabled: {
      type: Boolean,
      default: false
    },
    plugins: {
      type: [String, Array],
      default: 'link lists image media code table wordcount axupimgs'
    },
    toolbar: {
      type: [String, Array],
      default: 'fontsizeselect | forecolor backcolor | alignleft aligncenter alignright alignjustify | bullist numlist | outdent indent blockquote | undo redo | link unlink image media code axupimgs | removeformat'
    },
    uploadCallback: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      editorInit: {
        language_url: '/tinymce/langs/zh_CN.js',
        language: 'zh_CN',
        skin_url: '/tinymce/skins/ui/oxide',
        height: 300,
        plugins: this.plugins,
        toolbar: this.toolbar,
        statusbar: true, // 底部的状态栏
        menubar: true, // 最上方的菜单
        branding: false, // 水印“Powered by TinyMCE”
        images_upload_handler: (blobInfo, success, failure) => {
          if (this.uploadCallback) {
            this.$emit('handleImgUpload', blobInfo, success, failure)
          } else {
            const formData = new FormData()
            formData.append('file', blobInfo.blob())
            request({
              method: 'post',
              url: '/ps/common/file/upload',
              data: formData,
              processData: false, // 告诉axios不要去处理发送的数据(重要参数)
              contentType: false // 告诉axios不要去设置Content-Type请求头
            }).then((res) => {
              console.log('image')
              if (res.success) {
                success(res.data.fileUrl.match(/\/file\/.*/)[0])
              } else {
                failure()
              }
            }).catch((err) => {
              failure(err)
            })
          }
        },
        file_picker_callback: (callback, value, meta) => {
          if (meta.filetype === 'media' || meta.filetype === 'image') {
            // 模拟本地上传
            const input = document.createElement('input')
            input.setAttribute('type', 'file')
            if (meta.filetype === 'image') {
              input.setAttribute('accept', 'image/*')
            } else {
              input.setAttribute('accept', 'video/*')
            }
            input.onchange = function () {
              const file = this.files[0]
              const formData = new FormData()
              formData.append('file', file)
              request({
                method: 'post',
                url: '/ps/common/file/upload',
                data: formData,
                processData: false, // 告诉axios不要去处理发送的数据(重要参数)
                contentType: false // 告诉axios不要去设置Content-Type请求头
              }).then((res) => {
                console.log(res, 'video')
                if (res.success) {
                  callback(res.data.fileUrl.match(/\/file\/.*/)[0]) // 全路径video标签无法播放，必须使用相对路径代理
                }
              })
            }
            input.click()
          }
        },
        init_instance_callback: (editor) => {
          if (this.value) {
            editor.setContent(this.value)
          }
          editor.on('NodeChange Change KeyUp SetContent', () => {
            this.$emit('input', editor.getContent())
          })
        }
      },
      editorId: this.id
    }
  },
  mounted() {
    tinymce.init({})
  },
  methods: {
    handleClick(e) {
      this.$emit('onClick', e, tinymce)
    },
    clear() {
      this.$refs.myEditor.editor.setContent('')
    }
  }
}
</script>

<style lang="scss">
.tox-tinymce {
  width: 100% !important;
}
</style>
