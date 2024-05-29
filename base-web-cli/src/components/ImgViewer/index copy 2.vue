<template>
  <!-- 
    引入组件形式使用

    可以赋值img标签属性，也可以通过js事件打开预览组件
   -->
  <div class="demo-image__preview">
    <!-- <el-image style="width: 100px; height: 100px" :src="url" :preview-src-list="srcList"></el-image> -->
    
    <img :src="url" @click="showImg(url)" />
    <el-image-viewer
      style="z-index: 2222"
      v-if="imgPreviewVisible"
      :on-close="
        () => {
          this.imgPreviewVisible = false
        }
      "
      :url-list="srcList"
    />
  </div>
</template>

<script>
export default {
  data() {
    return {
      imgPreviewVisible: false,
      url: 'https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg',
      srcList: []
    }
  },
  methods: {
    showImg(img) {
      this.imgPreviewVisible = true
      this.srcList = [img]
    }
  }
}
</script>
