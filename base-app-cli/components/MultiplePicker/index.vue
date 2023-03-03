<template>
  <!-- 移动端多选picker使用规范：
    <multiple-picker
      :columns="formItem.list"
      :name="formItem.prop"
      :disabled="formItem.disabled"
      :input-align="formItem.align || 'right'"
      :label-width="formItem.labelPosition === 'top' ? '100%' : formItem.labelWidth || '7em'"
      :style="{ flexDirection: formItem.labelPosition === 'top' ? 'column' : 'unset'}"
      right-icon="arrow"
      :rules="[
        {
          required: formItem.required === false ? false : true,
          message: '请确认必选项'
        },
        {
          pattern: formItem.pattern || /[\s\S]*/,
          message: '请确认格式'
        }
      ]"
      :required="formItem.required === false ? false : true"
      :value="formData[panelIndex][formItem.prop]"
      :formData="formData[panelIndex]"
      :label="formItem.label"
      :optionKey="formItem.optionKey"
      :optionName="formItem.optionName"
      :placeholder="formItem.placeholder || '请选择'"
      :formItem="formItem"
    />
  -->
  <div>
    <van-field
      readonly
      clickable
      type="textarea"
      right-icon="arrow"
      :label="label"
      :required="required"
      :rules="rules"
      :name="name"
      :value="values"
      :placeholder="placeholder"
      :input-align="inputAlign"
      @click="selectClick"
    />
    <div v-if="showType" class="popup-bg">
      <div class="popup">
        <div class="btn">
          <div @click="cancel" class="cancle">取消</div>
          <div @click="confirm" class="confirm">确定</div>
        </div>
        <div class="checkbox-list">
          <van-checkbox-group v-model="result">
            <van-cell-group>
              <van-cell
                v-for="(item, index) in columns"
                clickable
                :key="index"
                :title="item[optionName]"
                @click="toggle(item, index)"
              >
                <template #right-icon>
                  <van-checkbox :name="item[optionKey]" ref="checkboxes" />
                </template>
              </van-cell>
            </van-cell-group>
          </van-checkbox-group>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    columns: {
      type: Array,
      default: () => []
    },
    label: {
      type: String,
      default: ''
    },
    value: {
      type: String,
      default: ''
    },
    optionName: {
      type: String,
      default: 'name'
    },
    optionKey: {
      type: String,
      default: 'code'
    },
    required: {
      type: Boolean,
      default: true
    },
    rules: {
      type: [String, Array],
      default: () => []
    },
    name: {
      type: String,
      default: ''
    },
    formData: {
      type: Object,
      default: () => {}
    },
    placeholder: {
      type: String,
      default: '请选择'
    },
    inputAlign: {
      type: String,
      default: 'right'
    },
    formItem: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      showType: false,
      currentNames: [], // 当前names
      currentCodes: [], // 当前codes
      originNames: [], // 打开时初始names
      originCodes: [], // 打开时初始codes
      values: '', // field展示值
      result: [] // checkbox展示值
    }
  },
  mounted() {
    // 编辑进来回显
    if (this.value) {
      this.values = this.value
      this.currentNames = this.value.split(',')
      this.currentCodes = this.value.split(',').map(v => {
        return this.columns.find(x => x[this.optionName] === v)[this.optionKey]
      })
    }
  },
  methods: {
    selectClick() {
      this.showType = true
      this.originNames = [...this.currentNames]
      this.originCodes = [...this.currentCodes]
      this.result = this.currentCodes
    },
    confirm() {
      // 移动端选择器需要以name形式传输，方便最后提交时统一转换
      this.showType = false
      this.values = this.currentNames.toString()
      this.formData[this.name] = this.values
      console.log(this.currentNames, 234)
    },
    cancel() {
      // 重置成修改前
      this.showType = false
      this.currentNames = [...this.originNames]
      this.currentCodes = [...this.originCodes]
    },
    toggle(item) {
      if (!this.currentNames.includes(item[this.optionName])) {
        this.currentNames.push(item[this.optionName])
      } else {
        const index = this.currentNames.indexOf(item[this.optionName])
        this.currentNames.splice(index, 1)
        console.log(this.currentNames, 666)
      }
      if (!this.currentCodes.includes(item[this.optionKey])) {
        this.currentCodes.push(item[this.optionKey])
      } else {
        const index = this.currentCodes.indexOf(item[this.optionKey])
        this.currentCodes.splice(index, 1)
      }
    }
  }
}
</script>
<style>
.popup-bg {
  background: rgba(0, 0, 0, 0.7);
  width: 100%;
  height: 100%;
  position: fixed;
  top: 0;
  left: 0;
  z-index: 999;
}
.btn {
  display: flex;
  justify-content: space-between;
}
.cancle {
  padding: 15px 0px 15px 18px;
  font-size: 14px;
  color: #576b95;
}
.confirm {
  padding: 15px 18px 15px 0px;
  font-size: 14px;
  color: #576b95;
}
.popup {
  position: absolute;
  bottom: 0;
  left: 0;
  z-index: 100;
  width: 100%;
  height: 400px;
  overflow: auto;
  background: #fff;
}
.checkbox-list {
  height: 346px;
  overflow-y: auto;
}
</style>
