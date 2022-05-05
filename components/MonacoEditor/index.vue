<template>
  <div class="monaco-editor">
    <button @click="getValue">点击</button>
    <div id="container" style="width: 400px; height: 400px"></div>
  </div>
</template>

<script>
import * as monaco from 'monaco-editor'
export default {
  data() {
    return {
      editor: null
    }
  },
  mounted() {
    this.initEditor()
  },
  methods: {
    initEditor() {
      this.editor = monaco.editor.create(document.getElementById('container'), {
        value: this.code, // 代码
        readOnly: false, // 只读
        language: 'mysql', // 语法
        theme: 'vs-dark', // 主题 vs/vs-dark/hc-black （可使用defineTheme中的主题）
        folding: true, // 代码折叠
        position: true,
        showFoldingControls: 'always', // 折叠图标显示 mouseover/always
        quickSuggestions: true, // 支持搜索 ctrl + F
        automaticLayout: true, // resize自动布局
        cursorStyle: 'line', // 光标样式 line/block/underline/line-thin/block-outline/underline-thin
        roundedSelection: true // 控制选区是否有圆角
      })
    },
    getValue() {
      const val = this.editor.getValue()
      console.log(val)
    }
  }
}
</script>
