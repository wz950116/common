<template>
  <!-- 对接宇视平台 -->
  <div class="video-comp-container" :style="style">
    <!-- <video :id="'video-' + cameraCode" class="video-js vjs-default-skin vjs-big-play-centered" controls preload="auto" :width="width" :height="height">
      <source :src="url" type="application/x-mpegURL" />
    </video> -->
    <div v-show="loadSource" class="video-box"></div>
    <!-- 占位标签 否则m3u8加载过程中会空白 -->
    <video v-if="!loadSource" src="" controls></video>
    <!-- 云台控制 -->
    <CloudControl :cameraCode="cameraCode"></CloudControl>
  </div>
</template>

<script>
/* eslint-disable */
import videojs from 'video.js'
import 'videojs-contrib-hls'
export default {
  name: 'XgVideo',
  props: {
    width: {
      default: '100%'
    },
    height: {
      default: 440
    },
    cameraCode: {
      default: ''
    }
  },
  components: {
    CloudControl: () => import('@/components/CloudControl')
  },
  data() {
    return {
      url: null,
      player: null,
      showVideo: false,
      loadSource: false
    }
  },
  computed: {
    style() {
      return `width: ${this.width}; height: ${this.height}px`
    }
  },
  watch: {
    cameraCode: {
      handler(val) {
        this.loadSource = false
        if (val) {
          this.destoryVideo()
          // mediatype  live(直播) or vodlive(回放)
          // resolution 分辨率 0-原始码流流 1-QCIF 2-CIF 3-2CIF 4-4CIF 5-D1 6-720P
          const mediatype = 'live'
          const resolution = 4
          // this.url = `${window.location.origin}/xgvideo/${mediatype}/loadmin/f9a2a03c08de21165a9256e52a5ef381/${resolution}/${this.cameraCode}.m3u8`
          // 测试数据
          if (val === 1) {
            this.url = `${window.location.origin}/xgvideo/${mediatype}/loadmin/f9a2a03c08de21165a9256e52a5ef381/${resolution}/${this.cameraCode}.m3u8`
          } else {
            this.url = `http://10.10.77.102:80/rtp/061475C4/hls.m3u8?accessId=xinyu&timestamp=1704959942953&accessSign=bbbe83ac0ef6370d4601b3502c67bd77&streamId=33112400001180000002_33112400001320000002`
          }
        }
        this.$nextTick(() => {
          if (val) {
            this.getVideo()
          } else {
            this.destoryVideo()
          }
        })
      },
      immediate: true
    }
  },
  methods: {
    getVideo() {
      const _this = this
      const element = document.getElementById('video-' + this.cameraCode)
      if (!element) {
        const html = `<video
          id="${'video-' + this.cameraCode}"
          class="video-js vjs-default-skin vjs-big-play-centered"
          controls
          preload="auto"
          width="${this.width}"
          height="${this.height}"
        >
          <source
            src="${this.url}"
            type="application/x-mpegURL"
          />
        </video>`
        document.getElementsByClassName('video-box')[0].innerHTML = html
      }
      this.player = videojs(
        'video-' + this.cameraCode,
        {
          controls: true,
          bigPlayButton: false, // 显示播放按钮
          textTrackDisplay: false,
          posterImage: false,
          errorDisplay: false,
          muted: true,
          controlBar: false // 显示控件
        },
        function () {
          this.play()
          this.on('loadstart', function () {
            console.log('开始请求数据 ')
          })
          this.on('progress', function () {
            console.log('正在请求数据 ')
          })
          this.on('loadedmetadata', function () {
            _this.loadSource = true
            console.log('获取资源长度完成 ')
          })
          this.on('canplaythrough', function () {
            console.log('视频源数据加载完成')
          })
          this.on('play', function () {
            console.log('视频开始播放')
          })
          this.on('waiting', function () {
            console.log('等待数据')
          })
          this.on('error', function (err) {
            console.log(err, '错误')
          })
        }
      )
      this.player.on('loadeddata', () => {
        console.log('event - loadeddata')
      })
    },
    destoryVideo() {
      this.player && this.player.dispose()
      this.player = null
    }
  },
  beforeDestroy() {
    this.destoryVideo()
  }
}
</script>

<style lang="scss">
.video-comp-container {
  position: relative;
  .vjs-loading-spinner,
  .vjs-modal-dialog {
    display: none;
  }
  video {
    object-fit: fill;
  }
  .video-box {
    width: 100%;
    height: 100%;
  }
}
.video-js,
video {
  display: block;
  height: 100%;
  width: 100%;
  background: #000;
}
</style>
