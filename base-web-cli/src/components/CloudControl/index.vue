<template>
  <!-- 宇视云台控制 -->
  <div class="cloud-control">
    <ul class="unv-ptz">
      <li>
        <div class="unv-ptz-control">
          <div v-for="(item, index) in controls" :key="index">
            <span v-for="i in item.list" :key="i.down + i.up" @mousedown="onMousedown(i.down)" @mouseup="onMouseup(i.up)"></span>
          </div>
        </div>
      </li>
      <!-- <li>
        <div class="unv-ptz-btn">
          <span id="bigMultiple" title="变倍 +" @mousedown="onMousedown2('770')" @mouseup="onMouseup2('769')"></span>
          <span id="smallMultiple" title="变倍 -" @mousedown="onMousedown2('772')" @mouseup="onMouseup2('771')"></span>
        </div>
        <div class="unv-ptz-btn">
          <span id="bigZoom" title="变焦 +" @mousedown="onMousedown2('516')" @mouseup="onMouseup2('515')"></span>
          <span id="smallZoom" title="变焦 -" @mousedown="onMousedown2('514')" @mouseup="onMouseup2('513')"></span>
        </div>
      </li> -->
    </ul>
    <!-- <div>
      云台转速：
      <el-select v-model="speed" placeholder="">
        <el-option label="9" :value="9"></el-option>
        <el-option label="8" :value="8"></el-option>
        <el-option label="7" :value="7"></el-option>
        <el-option label="6" :value="6"></el-option>
        <el-option label="5" :value="5"></el-option>
        <el-option label="4" :value="4"></el-option>
        <el-option label="3" :value="3"></el-option>
        <el-option label="2" :value="2"></el-option>
        <el-option label="1" :value="1"></el-option>
      </el-select>
    </div> -->
  </div>
</template>

<script>
import axios from 'axios'
export default {
  props: {
    // 云台摄像机编码
    cameraCode: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      userName: 'chengguan',
      userPwd: 'Cci@1234',
      serviceIp: '172.30.100.108',
      viidToken: '',
      speed: 9, // 转速
      controls: [
        {
          list: [
            {
              down: '1794',
              up: '1793'
            },
            {
              down: '1026',
              up: '1025'
            },
            {
              down: '2050',
              up: '2049'
            }
          ]
        },
        {
          list: [
            {
              down: '1284',
              up: '1283'
            },
            {
              down: '1283',
              up: '1281'
            },
            {
              down: '1282',
              up: '1281'
            }
          ]
        },
        {
          list: [
            {
              down: '1796',
              up: '1795'
            },
            {
              down: '1028',
              up: '1027'
            },
            {
              down: '2052',
              up: '2051'
            }
          ]
        }
      ]
    }
  },
  mounted() {
    axios.post('http://' + this.serviceIp + ':8088' + '/VIID/login').then((res) => {
      if (res.data.AccessCode) {
        this.loginIn2(res.data.AccessCode)
      } else {
        this.$message({
          type: 'warning',
          message: '请重新登陆'
        })
      }
    })
  },
  methods: {
    // 登录 获取viidToken
    loginIn2(accesscode) {
      const enuserName = window.base64encode(this.userName)
      const enuserPwd = window.hex_md5(this.userPwd)
      const login_signature = window.hex_md5(enuserName + accesscode + enuserPwd)
      axios
        .post('http://' + this.serviceIp + ':8088' + '/VIID/login', {
          UserName: this.userName,
          AccessCode: accesscode,
          LoginSignature: login_signature
        })
        .then((res) => {
          if (res.data.AccessToken) {
            this.viidToken = res.data.AccessToken
          } else {
            this.$message({
              type: 'error',
              message: res.ErrMsg
            })
          }
        })
    },
    onMousedown(cmdId) {
      this.ctrlPtzBySelf(cmdId, [this.speed, this.speed, 0])
    },
    onMouseup(cmdId) {
      this.ctrlPtzBySelf(cmdId, [this.speed, this.speed, 0])
    },
    onMousedown2(cmdId) {
      this.ctrlPtzBySelf(cmdId, [0, 0, 0])
    },
    onMouseup2(cmdId) {
      this.ctrlPtzBySelf(cmdId, [0, 0, 0])
    },
    ctrlPtzBySelf(cmdId, ary2) {
      if (cmdId) {
        axios
          .post(
            'http://' + this.serviceIp + ':8088/VIID/ptz/ctrl/' + this.cameraCode,
            {
              PTZCmdID: cmdId - 0,
              PTZCmdPara1: ary2[0],
              PTZCmdPara2: ary2[1],
              PTZCmdPara3: ary2[2]
            },
            {
              headers: {
                'Content-Type': 'application/json',
                Authorization: this.viidToken
              }
            }
          )
          .then(() => {})
      }
    }
  }
}
</script>

<style scoped>
.cloud-control {
  position: absolute;
  right: 20px;
  bottom: 10px;
  opacity: 0.6;
}
.unv-ptz {
  padding: 0;
}
.unv-ptz-control {
  background: url(./ptz.png) no-repeat;
  background-size: contain;
  width: 80px;
  height: 80px;
  border-radius: 50%;
  overflow: hidden;
  cursor: pointer;
}
.unv-ptz li {
  display: inline-block;
  vertical-align: middle;
}
.unv-ptz-control div {
  width: 100%;
  height: 33.3%;
}
.unv-ptz-control div span {
  width: 33.3%;
  height: 100%;
  display: inline-block;
}
.unv-ptz-btn {
  margin-left: 20px;
}
.unv-ptz-btn + .unv-ptz-btn {
  margin-top: 20px;
}
.unv-ptz-btn span {
  background: url(./ptz_btn.png) no-repeat;
  width: 48px;
  height: 27px;
  display: inline-block;
  cursor: pointer;
}
#bigMultiple {
  background-position: -96px 0px;
}
#bigMultiple:hover {
  background-position: -96px -27px;
}
#smallMultiple {
  background-position: -144px 0px;
}
#smallMultiple:hover {
  background-position: -144px -27px;
}
#bigZoom {
  background-position: 0px 0px;
}
#bigZoom:hover {
  background-position: 0px -27px;
}
#smallZoom {
  background-position: -48px 0px;
}
#smallZoom:hover {
  background-position: -48px -27px;
}
</style>