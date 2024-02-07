<template>
  <c-drawer :visible="value" :title="title" append-to-body direction="rtl" size="40vw" @close="onCancel">
    <div class="detail-wrap">
      <div class="detail-content">
        <div class="detail-info">
          <el-form ref="detailForm" :model="detailForm" :rules="rules" label-width="100px">
            <el-col :span="12">
              <el-form-item label="单位名称" prop="unitName">
                <el-input v-model="detailForm.unitName" placeholder="请输入单位名称" clearable />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="电话" prop="tel">
                <el-input v-model="detailForm.tel" placeholder="请输入电话" clearable />
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item label="地址">
                <!-- <amap ref="map" use-click @map-click="mapClick" /> -->
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item label="" prop="address">
                <el-input v-model="detailForm.address" placeholder="请选择地址" clearable />
              </el-form-item>
            </el-col>
          </el-form>
        </div>
      </div>
      <div class="footer">
        <el-button @click="onCancel"> 取消 </el-button>
        <el-button type="primary" @click="onConfirm"> 确认 </el-button>
      </div>
    </div>
  </c-drawer>
</template>

<script>
// import amap from '@/components/AMap'
import { create, update } from '../store'

export default {
  name: 'HandlePage',
  // components: { amap },
  props: {
    value: {
      type: Boolean,
      default: false
    },
    rowItem: {
      type: Object,
      default: () => {}
    },
    rowType: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      detailForm: {
        address: '',
        lat: '',
        lon: '',
        tel: '',
        unitName: ''
      },
      rules: {
        unitName: [{ required: true, message: '请输入单位名称', trigger: 'input' }],
        tel: [{ required: true, message: '请输入电话', trigger: 'input' }],
        address: [{ required: true, message: '请输入地址', trigger: 'input' }]
      }
    }
  },
  computed: {
    title() {
      return this.rowType === 'add' ? '新增' : '编辑'
    }
  },
  watch: {
    value(n) {
      if (n) {
        this.$refs.map.searchVal = ''
        this.$refs.map.addressOptions = []
        if (this.rowType === 'add') {
          this.detailForm = {
            address: '',
            lat: '',
            lon: '',
            tel: '',
            unitName: ''
          }
          this.$refs.map && this.$refs.map.removeMarker()
        } else {
          this.detailForm = { ...this.rowItem }
          this.$nextTick(() => {
            this.$refs.map.initMarker([this.detailForm.lon, this.detailForm.lat])
          })
        }
      }
    }
  },
  methods: {
    mapClick(lnglat) {
      this.detailForm.lat = lnglat.lat
      this.detailForm.lon = lnglat.lng
      this.$refs.map.getAddress([lnglat.lng, lnglat.lat], (address) => {
        this.detailForm.address = address
      })
    },
    onCancel() {
      this.$emit('input', false)
      this.detailForm = {
        address: '',
        lat: '',
        lon: '',
        tel: '',
        unitName: ''
      }
    },
    onConfirm() {
      this.$refs.detailForm.validate(async (valid) => {
        if (valid) {
          if (!this.detailForm.lon || !this.detailForm.lat) {
            this.$message.warning('请从地图上选择点位获取经纬度')
            return
          }
          this.$confirm('是否确认该操作?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(async () => {
            const api = this.rowType === 'add' ? create : update
            api(this.detailForm).then(({ success, message }) => {
              if (success) {
                this.$message.success('操作成功')
                this.$emit('onSubmit')
                this.onCancel()
              } else {
                this.$message.error(message)
              }
            })
          })
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.detail-wrap {
  display: flex;
  flex-direction: column;
  height: 100%;
  padding: 12px;
}
.detail-content {
  display: flex;
  flex-direction: column;
  overflow: auto;
  flex: 1;
}
.footer {
  display: flex;
  justify-content: flex-end;
  padding: 30px 20px;
}
</style>
