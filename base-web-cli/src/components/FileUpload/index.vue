<!-- 图片视频音频上传 -->
<template>
  <div class="file-upload">
    <el-upload
      ref="upload"
      :action="action"
      :accept="`${acceptType}/${subType}`"
      :file-list="originList"
      :before-upload="handleBeforeUpload"
      list-type="picture-card"
    >
      <i class="el-icon-plus"></i>
      <template v-if="file.status === 'success'" slot="file" slot-scope="{file}">
        <div class="upload-file-content">
          <img v-if="acceptType === 'image'" class="el-upload-list__item-thumbnail" :src="file.url">
          <video
            v-if="acceptType === 'video' || acceptType === 'audio'"
            class="el-upload-list__item-thumbnail"
            :src="file.url"
            :poster="acceptType === 'audio' ? require('./music.png') : ''"
          ></video>
          <label class="el-upload-list__item-status-label">
            <i class="el-icon-upload-success el-icon-check"></i>
          </label>
          <span class="el-upload-list__item-actions">
            <span v-if="acceptType === 'image'" class="el-upload-list__item-preview" @click="handlePicturePreview(file)">
              <i class="el-icon-zoom-in"></i>
            </span>
            <span v-if="acceptType === 'video' || acceptType === 'audio'" class="el-upload-list__item-preview" @click="handleMediaPreview(file)">
              <i class="el-icon-video-play"></i>
            </span>
            <span class="el-upload-list__item-delete" @click="handleRemove(file)">
              <i class="el-icon-delete"></i>
            </span>
          </span>
        </div>
      </template>
    </el-upload>
    <el-dialog
      title="播放"
      :visible.sync="mediaDialogVisiable"
      width="500"
      top="5vh"
      append-to-body
      @close="mediaDialogClose"
    >
      <video
        ref="mediaPlayer"
        controls
        autoplay
        :src="mediaPlayUrl"
        width="100%"
        height="auto"
      ></video>
    </el-dialog>
  </div>
</template>
<script>
import compress from './compress'
export default {
  props: {
    action: {
      type: String,
      default: '/oauth2/file/upload'
    },
    // image、video、audio
    acceptType: {
      type: String,
      default: 'video'
    },
    // 副类型
    subType: {
      type: String,
      default: '*'
    },
    // 文件列表
    fileList: {
      type: Array,
      default() {
        return []
      }
    },
    // 上传数量上限
    limit: {
      type: Number,
      default: 0
    },
    // 上传大小上限，MB
    size: {
      type: Number,
      default: 0
    },
    // 图片质量
    quality: {
      type: Number,
      default: 0.3
    }
  },
  data() {
    return {
      originList: [],
      mediaDialogVisiable: false,
      mediaPlayUrl: ''
    }
  },
  watch: {
    fileList(newList) {
      this.handleFileListChange(newList)
    }
  },
  created() {
    this.handleFileListChange(this.fileList)
  },
  methods: {
    handleFileListChange(fileList) {
      const newList = []
      for (const file of fileList) {
        if (!file) {
          throw Error('fileList格式错误！')
        }
        if (typeof file === 'string') {
          newList.push({ url: file })
        } else if (typeof file === 'object' && file.url) {
          newList.push(file)
        }
      }
      this.originList = newList
    },
    handleBeforeUpload(file) {
      if (this.size) {
        const fileSize = file.size / 1024 / 1024
        if (this.size < fileSize) {
          this.$message({ type: 'warning', message: `上传文件限制大小为：${this.size}MB` })
          return false
        }
      }
      if (this.limit) {
        const uploadFiles = this.$refs.upload.uploadFiles
        const length = uploadFiles.length
        if (this.limit < length) {
          this.$message({ type: 'warning', message: `上传文件最大数量为：${this.limit}个` })
          return false
        }
      }
      if (this.quality && this.quality > 0) {
        return new Promise((resolve) => {
          this.processFile(file, resolve)
        })
      }
    },
    processFile(file, next) {
      const reader = new FileReader()
      reader.onload = (e) => {
        var data = e.target.result
        // 加载图片获取图片真实宽度和高度
        var image = new Image()
        image.onload = () => {
          compress(file, {
            compress: {
              width: image.width,
              height: image.height,
              quality: this.quality
            },
            type: 'file'
          }, next)
        }
        image.src = data
      }
      reader.readAsDataURL(file)
    },
    handleRemove(file) {
      const index = this.$refs.upload.uploadFiles.findIndex(item => item === file)
      this.$refs.upload.uploadFiles.splice(index, 1)
    },
    handlePicturePreview(file) {
      this.$createImgViewer({
        $props: {
          images: [file.url]
        }
      }).show()
    },
    handleMediaPreview(file) {
      this.mediaDialogVisiable = true
      this.mediaPlayUrl = file.url
    },
    mediaDialogClose() {
      if (this.$refs.mediaPlayer) {
        this.mediaPlayUrl = ''
      }
    },
    getFileList(needSimple) {
      const uploadFiles = this.$refs.upload.uploadFiles.filter(item => item.status === 'success')
      if (needSimple) {
        return uploadFiles.map(item => {
          return item.response ? item.response.data.fileUrl : item.url
        })
      } else {
        return uploadFiles.map(item => {
          if (item.response) {
            const { fileUrl, fileName, fileExt } = item.response.data
            return {
              url: fileUrl,
              name: fileName,
              extName: fileExt
            }
          } else {
            return { ...item }
          }
        })
      }
    }
  }
}
</script>
<style lang="scss">
.file-upload {
  .el-upload-list--picture-card {
    display: inline-block;
    .el-upload-list__item {
      margin-bottom: 0;
    }
  }
  .el-progress {
    width: 76px;
    height: 76px;
    .el-progress-circle {
      width: 100% !important;
      height: 100% !important;
    }
  }
  .upload-file-content {
    height: 100%;
    img {
      height: 100%;
      width: 100%;
    }
    video {
      height: 100%;
      width: 100%;
      object-fit: fill;
    }
  }
}
</style>
