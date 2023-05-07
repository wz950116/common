<template>
  <div class="myFormContainer">
    <div class="formContainer" v-for="(panel, panelIndex) in formOptions" :key="panelIndex">
      <div class="f-title" v-if="panel.title">{{ panel.title }}</div>
      <cmb-form ref="formRef" validate-first>
        <div v-if="panel && formData[panelIndex]">
          <div :class="['formItem', formItem.prop]" v-for="(formItem, formItemIndex) in panel.formItems" :key="formItemIndex">
            <div class="readOnlyModel" v-if="readonly">
              <!-- 只读模式 -->
              <!-- 文本 -->
              <cmb-field
                :name="formItem.prop"
                v-if="readonlyInput(formItem.type) === 'input'"
                v-model="formData[panelIndex][formItem.prop]"
                :label-width="formItem.labelPosition === 'top' ? '100%' : formItem.labelWidth || '7em'"
                :style="{
                  flexDirection: formItem.labelPosition === 'top' ? 'column' : 'unset'
                }"
                disabled
                input-align="right"
                :label="formItem.label + (formItem.suffixText ? `(${formItem.suffixText})` : '')"
              />

              <!-- 文本域 -->
              <cmb-field
                :name="formItem.prop"
                v-if="readonlyInput(formItem.type) === 'textarea'"
                autosize
                disabled
                input-align="left"
                :label-width="formItem.labelPosition === 'top' ? '100%' : formItem.labelWidth || '7em'"
                :style="{
                  flexDirection: formItem.labelPosition === 'top' ? 'column' : 'unset'
                }"
                v-model="formData[panelIndex][formItem.prop]"
                class="flexCol"
                :label="formItem.label"
                type="textarea"
              />

              <!-- 插槽 -->
              <cmb-field
                v-if="readonlyInput(formItem.type) === 'slot'"
                disabled
                :input-align="formItem.align || 'right'"
                v-model="formData[panelIndex][formItem.prop]"
                :label="formItem.label"
                :label-width="formItem.labelPosition === 'top' ? '100%' : formItem.labelWidth || '7em'"
                :style="{
                  flexDirection: formItem.labelPosition === 'top' ? 'column' : 'unset'
                }"
              >
                <template #input>
                  <!-- eslint-disable-next-line vue/valid-v-bind -->
                  <slot
                    :name="formItem.slotName"
                    v-bind="{
                      formData,
                      formItem,
                      panelIndex
                    }"
                  />
                </template>
              </cmb-field>

              <!-- 图片 -->
              <cmb-field
                v-if="readonlyInput(formItem.type) === 'upload'"
                disabled
                :input-align="formItem.align || 'right'"
                :label="formItem.label"
                :label-width="formItem.labelPosition === 'top' ? '100%' : formItem.labelWidth || '7em'"
                :style="{
                  flexDirection: formItem.labelPosition === 'top' ? 'column' : 'unset'
                }"
              >
                <template #input>
                  <cmb-image
                    v-for="(url, urlIndex) in formData[panelIndex][formItem.prop]"
                    width="80"
                    height="80"
                    :key="urlIndex"
                    :src="typeof url === 'string' ? url : url.url"
                    @click="preview(formData[panelIndex][formItem.prop], urlIndex)"
                  />
                </template>
              </cmb-field>

              <!-- 分割线 -->
              <div class="borderLine" v-if="formItemIndex < panel.formItems.length && !(formItem.bottom === false)"></div>
            </div>

            <!-- 表单模式 -->
            <div v-else>
              <!-- 普通输入框 -->
              <div v-if="formItem.type === 'input'">
                <cmb-field
                  :name="formItem.prop"
                  :type="formItem.fieldType || 'text'"
                  clearable
                  :disabled="formItem.disabled"
                  :input-align="formItem.align || 'right'"
                  v-model="formData[panelIndex][formItem.prop]"
                  :maxlength="formItem.maxlength"
                  :autocomplete="formItem.autocomplete || 'off'"
                  :label-width="formItem.labelPosition === 'top' ? '100%' : formItem.labelWidth || '7em'"
                  :style="{
                    flexDirection: formItem.labelPosition === 'top' ? 'column' : 'unset'
                  }"
                  :required="formItem.required === false ? false : true"
                  :label="formItem.label + (formItem.suffixText ? `(${formItem.suffixText})` : '')"
                  :placeholder="formItem.placeholder || '请输入' + formItem.label"
                  :trigger="['onBlur']"
                  :rules="[
                    {
                      required: formItem.required === false ? false : true,
                      message: '请确认必填项'
                    },
                    {
                      pattern: formData[panelIndex][formItem.prop] ? formItem.pattern || /[\s\S]*/ : formItem.required === false ? /[\s\S]*/ : formItem.pattern,
                      message: formItem.placeholder || '请确认格式'
                    }
                  ]"
                  v-bind="formItem.attrs"
                />
              </div>

              <!-- 下拉选择框 -->
              <div v-if="formItem.type === 'select' && !formItem.multiple">
                <cmb-field
                  :name="formItem.prop"
                  readonly
                  clearable
                  :disabled="formItem.disabled"
                  :input-align="formItem.align || 'right'"
                  :label-width="formItem.labelPosition === 'top' ? '100%' : formItem.labelWidth || '7em'"
                  :style="{
                    flexDirection: formItem.labelPosition === 'top' ? 'column' : 'unset'
                  }"
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
                  :label="formItem.label"
                  :placeholder="formItem.placeholder || '请选择'"
                  @click="!formItem.disabled ? selectClick(panelIndex, formItem) : null"
                />
                <cmb-popup v-model="showPicker[panelIndex][formItem.prop]" position="bottom" get-container="body">
                  <cmb-picker
                    show-toolbar
                    :columns="pickerColumns[panelIndex][formItem.prop]"
                    @confirm="(value) => onConfirm(panelIndex, value, formItem)"
                    @cancel="showPicker[panelIndex][formItem.prop] = false"
                  />
                </cmb-popup>
              </div>

              <!-- 下拉多选框 -->
              <div v-if="formItem.type === 'select' && formItem.multiple">
                <multiple-picker
                  :columns="formItem.list"
                  :name="formItem.prop"
                  :disabled="formItem.disabled"
                  :input-align="formItem.align || 'right'"
                  :label-width="formItem.labelPosition === 'top' ? '100%' : formItem.labelWidth || '7em'"
                  :style="{
                    flexDirection: formItem.labelPosition === 'top' ? 'column' : 'unset'
                  }"
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
              </div>

              <!-- 级联选择 -->
              <div v-if="formItem.type === 'cascader'">
                <cmb-field
                  :name="formItem.prop"
                  readonly
                  clearable
                  :disabled="formItem.disabled"
                  :input-align="formItem.align || 'right'"
                  :label-width="formItem.labelPosition === 'top' ? '100%' : formItem.labelWidth || '7em'"
                  :style="{
                    flexDirection: formItem.labelPosition === 'top' ? 'column' : 'unset'
                  }"
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
                  :label="formItem.label"
                  :placeholder="formItem.placeholder || '请选择'"
                  @click="!formItem.disabled ? selectClick(panelIndex, formItem) : null"
                />
                <cmb-popup v-model="showPicker[panelIndex][formItem.prop]" position="bottom" get-container="body">
                  <cmb-cascader
                    :options="pickerColumns[panelIndex][formItem.prop]"
                    :field-names="formItem.fieldNames"
                    @finish="(value) => onConfirm(panelIndex, value, formItem)"
                    @close="showPicker[panelIndex][formItem.prop] = false"
                  />
                </cmb-popup>
              </div>

              <!-- 单选框组 -->
              <div v-if="formItem.type === 'radioGroup'">
                <cmb-field
                  :name="formItem.prop"
                  clearable
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
                  :disabled="formItem.disabled"
                  :input-align="formItem.align || 'right'"
                  :required="formItem.required === false ? false : true"
                  :label-width="formItem.labelPosition === 'top' ? '100%' : formItem.labelWidth || '7em'"
                  :style="{
                    flexDirection: formItem.labelPosition === 'top' ? 'column' : 'unset'
                  }"
                  :label="formItem.label"
                >
                  <template #input>
                    <cmb-radio-group
                      v-model="formData[panelIndex][formItem.prop]"
                      :style="{
                        margin: formItem.labelPosition === 'top' ? '8px' : '0'
                      }"
                      direction="horizontal"
                    >
                      <cmb-radio v-for="(radio, i) in formItem.list" :key="i" icon-size="14px" :name="radio.label">
                        {{ radio.label }}
                      </cmb-radio>
                    </cmb-radio-group>
                  </template>
                </cmb-field>
              </div>

              <!-- 文本域 -->
              <div v-if="formItem.type === 'textarea'">
                <cmb-field
                  clearable
                  :name="formItem.prop"
                  autosize
                  :disabled="formItem.disabled"
                  :input-align="formItem.align || 'right'"
                  :label-width="formItem.labelPosition === 'top' ? '100%' : formItem.labelWidth || '7em'"
                  :style="{
                    flexDirection: formItem.labelPosition === 'top' ? 'column' : 'unset'
                  }"
                  v-model="formData[panelIndex][formItem.prop]"
                  :required="formItem.required === false ? false : true"
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
                  class="flexCol"
                  rows="2"
                  :label="formItem.label"
                  type="textarea"
                  :placeholder="formItem.placeholder || '请输入'"
                  show-word-limit
                  :maxlength="formItem.maxlength"
                >
                  <template v-if="formItem.showSound" #right-icon>
                    <img src="@/assets/images/sound.png" alt="" @touchstart="touchStart(formData[panelIndex], formItem.prop)" />
                  </template>
                </cmb-field>
              </div>

              <!-- 时间(日期)选择器 -->
              <div v-if="formItem.type === 'dateTime'">
                <cmb-field
                  readonly
                  :name="formItem.prop"
                  :label-width="formItem.labelPosition === 'top' ? '100%' : formItem.labelWidth || '7em'"
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
                  clearable
                  :disabled="formItem.disabled"
                  :input-align="formItem.align || 'right'"
                  :required="formItem.required === false ? false : true"
                  clickable
                  :value="formData[panelIndex][formItem.prop]"
                  :label="formItem.label"
                  :placeholder="formItem.placeholder || '请选择时间'"
                  @click="!formItem.disabled ? (showPicker[panelIndex][formItem.prop] = true) : null"
                >
                  <template v-slot:right-icon>
                    <div class="rightSlot">
                      <cmb-icon style="margin-right: 4px" name="notes-o" />
                      <cmb-icon name="arrow" />
                    </div>
                  </template>
                </cmb-field>

                <cmb-popup v-model="showPicker[panelIndex][formItem.prop]" position="bottom">
                  <cmb-datetime-picker
                    v-model="timePickerData[panelIndex][formItem.prop]"
                    :formatter="formatter"
                    :type="formItem.dateTimeType || 'datetime'"
                    :min-date="formItem.minDate || minDate"
                    :max-date="formItem.maxDate"
                    @confirm="(value) => onConfirm(panelIndex, value, formItem)"
                    @cancel="showPicker[panelIndex][formItem.prop] = false"
                  />
                </cmb-popup>
              </div>

              <!-- 文件上传 -->
              <div v-if="formItem.type === 'upload'">
                <!-- <div>
                  视频地址：<cmb-field v-model="abc" type="textarea"></cmb-field>
                </div> -->
                <cmb-field
                  :name="formItem.prop"
                  :disabled="formItem.disabled"
                  :input-align="formItem.align || 'right'"
                  v-model="formData[formItem.prop]"
                  :rules="[
                    {
                      required: formItem.required === false ? false : true,
                      message: '请确认必填项'
                    },
                    {
                      pattern: formItem.pattern || /[\s\S]*/,
                      message: '请确认格式'
                    }
                  ]"
                  :label="formItem.label"
                  :label-width="formItem.labelPosition === 'top' ? '100%' : formItem.labelWidth || '7em'"
                  :style="{
                    flexDirection: formItem.labelPosition === 'top' ? 'column' : 'unset'
                  }"
                  :required="formItem.required === false ? false : true"
                >
                  <template #input>
                    <cmb-uploader
                      :max-count="formItem.maxCount"
                      :multiple="formItem.multiple || false"
                      :accept="formItem.accept || 'image/*'"
                      :max-size="formItem.maxSize || 50 * 1024 * 1024"
                      v-model="file[panelIndex][formItem.prop]"
                      @oversize="() => onOversize(formItem.maxSize || 50 * 1024 * 1024)"
                      :after-read="(file, cur) => afterRead(file, cur, panelIndex, formItem)"
                      @delete="(file, cur) => deleteFile(file, cur, panelIndex, formItem)"
                      @click-preview="(file, cur) => onPreview(file, cur, panelIndex, formItem)"
                    />
                  </template>
                </cmb-field>
              </div>

              <!-- 插槽(部分) -->
              <div v-if="formItem.type === 'slot'">
                <cmb-field
                  :name="formItem.prop"
                  :disabled="formItem.disabled"
                  :input-align="formItem.align || 'right'"
                  v-model="formData[panelIndex][formItem.prop]"
                  :rules="
                    formItem.rules
                      ? formItem.rules
                      : [
                          {
                            required: formItem.required === false ? false : true,
                            message: '请确认必填项'
                          },
                          {
                            pattern: formItem.pattern || /[\s\S]*/,
                            message: '请确认格式'
                          }
                        ]
                  "
                  :label="formItem.label"
                  :label-width="formItem.labelPosition === 'top' ? '100%' : formItem.labelWidth || '7em'"
                  :style="{
                    flexDirection: formItem.labelPosition === 'top' ? 'column' : 'unset'
                  }"
                  :required="formItem.required === false ? false : true"
                >
                  <template #input>
                    <!-- eslint-disable-next-line vue/valid-v-bind -->
                    <slot
                      :name="formItem.slotName"
                      v-bind="{
                        formData,
                        formItem,
                        panelIndex
                      }"
                    />
                  </template>
                </cmb-field>
              </div>

              <!-- 插槽(全部) -->
              <div v-if="formItem.type === 'slotAll'">
                <slot
                  :name="formItem.slotName"
                  v-bind="{
                    formData,
                    formItem,
                    panelIndex
                  }"
                />
              </div>

              <!-- 分割线 -->
              <div class="borderLine" v-if="formItemIndex < panel.formItems.length && !(formItem.bottom === false)"></div>
            </div>
          </div>
        </div>
      </cmb-form>
    </div>
  </div>
</template>

<script>
import { timeFormatter } from './timeFormat.js'
import { ImagePreview } from '@cci/mcui'
import { fileUpload } from '@/api'
import { deepClone } from '@/utils'
import multiplePicker from '@/components/FieldPicker/src/multiplePicker'

// 注意  type为select，需要级联的话，需要带上cascader属性为true，必须有children字段
export default {
  name: 'myForm',
  components: { multiplePicker },
  props: {
    formOptions: {
      type: Array,
      default: () => []
    },
    readonly: {
      type: Boolean,
      default: () => false
    },
    fillData: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      abc: '',
      minDate: new Date(1970, 0, 1), // 默认时间选择器最小时间
      formData: [], // 表单数据
      timePickerData: [], // 时间数据 解决VanField 值不能是 date报错
      showPicker: [], // 下拉打开
      pickerColumns: [], // 下拉列表 vant 只要name
      pickerColumnsAll: [], // 原下拉列表
      file: [] // 文件上传
    }
  },
  created() {
    this.initForm()
  },
  watch: {
    readonly(val) {
      if (!val) {
        this.initForm()
        this.handlefillData(this.fillData)
      }
    },
    fillData: {
      handler(val) {
        if (val && val?.length) {
          this.handlefillData(val)
        }
      },
      deep: true,
      immediate: false
    },
    formOptions: {
      handler(val) {
        if (val && val?.length) {
          this.initForm()
        }
      },
      deep: false, // 如果深度监听会导致单独修改某个表单属性时重置formData，如果非要触发可以在自己页面主动调用initForm方法！
      immediate: true
    }
  },

  methods: {
    // 初始化表单
    initForm() {
      this.formOptions.forEach((x, index) => {
        const formData = {}
        const timePickerData = {}
        const showPicker = {}
        const pickerColumns = {}
        const pickerColumnsAll = {}
        const file = {}
        x.formItems.forEach((item, itemIndex) => {
          // 初始化表单数据
          // 是否需要监听
          if (item.on) {
            this.$nextTick(() => {
              this.$watch(
                () => {
                  return this.formData[index][item.prop]
                },
                (val) => {
                  if (this.readonly) return
                  item.on(val, item)
                }
              )
            })
          }
          formData[item.prop] = item.defaultValue === undefined ? null : item.defaultValue
          // 初始化下拉弹窗数据
          if (item.type === 'select' || item.type === 'cascader') {
            showPicker[item.prop] = false
          }

          // 文件上传
          if (item.type === 'upload') {
            file[item.prop] = []
          }

          // 弹层
          if (item.type === 'dateTime') {
            showPicker[item.prop] = false
            timePickerData[item.prop] = item.defaultValue ? new Date(item.defaultValue) : new Date()
          }
          if (item.list) {
            // 监听下拉数据 赋值
            this.$watch(
              () => {
                return this.formOptions[index].formItems[itemIndex].list
              },
              (val) => {
                if (this.readonly) return

                if (val.find((v) => v.children) && (item.cascader || item.type === 'cascader')) {
                  pickerColumns[item.prop] = val
                } else {
                  pickerColumns[item.prop] = val.map((x) => x[item.optionName || 'label'])
                }
                pickerColumnsAll[item.prop] = val.map((x) => {
                  return {
                    ...x,
                    label: x[item.optionName || 'label'],
                    value: x[item.optionKey || 'value']
                  }
                })
              },
              {
                immediate: true
              }
            )
          }
        })
        this.$set(this.file, index, file)
        this.$set(this.formData, index, formData)
        this.$set(this.timePickerData, index, timePickerData)
        this.$set(this.showPicker, index, showPicker)
        this.$set(this.pickerColumns, index, pickerColumns)
        this.$set(this.pickerColumnsAll, index, pickerColumnsAll)
      })
    },
    // 数据回填
    handlefillData(arr) {
      // 通过深拷贝处理formData 与 fillData 关联问题
      const list = deepClone(arr)

      list.forEach((formData, index) => {
        Object.keys(this.formData[index]).forEach((key) => {
          this.formData[index][key] = formData[key]
        })
      })
      // 处理
      this.formOptions.forEach((x, index) => {
        x.formItems.forEach((item, itemIndex) => {
          if (item.type === 'select' || item.type === 'radioGroup') {
            let data
            if (item.list.find((v) => v.children) && item.cascader) {
              item.list.forEach((v) => {
                data = v.children.find((_) => Number(_.value) === Number(this.formData[index][item.prop]))
                if (data) {
                  this.$set(this.formData[index], this.formOptions[index].formItems[itemIndex].prop, data?.text)
                }
              })
            } else {
              // 是否是多选
              if (item.multiple) {
                data = this.formData[index][item.prop]
                  .split(',')
                  .map((v) => {
                    return item.list.find((x) => x[item.optionKey || 'value'] === v)[item.optionName || 'label']
                  })
                  .toString()
                if (data) {
                  this.$set(this.formData[index], this.formOptions[index].formItems[itemIndex].prop, data)
                }
              } else {
                data = item.list.find((v) => {
                  return v[item.optionKey || 'value'] === this.formData[index][item.prop]
                })
                if (data) {
                  this.$set(this.formData[index], this.formOptions[index].formItems[itemIndex].prop, data[item.optionName || 'label'])
                }
              }
            }
          }
          if (item.type === 'upload') {
            try {
              this.file[index][item.prop] = this.formData[index][item.prop].map((v) => {
                return {
                  ...v,
                  url: v.filePath
                }
              })
              console.log(this.file[index][item.prop], 'this.file')
            } catch (err) {}
          }
        })
      })
    },
    // 返回去数据集
    async returnValue(cb, needTrans = true, needValidate = true) {
      const that = this
      const data = needTrans ? that.transValue() : JSON.parse(JSON.stringify(this.formData))
      if (needValidate) {
        for (let i = 0; i < that.formOptions.length; i++) {
          const valid = await that.$refs['formRef'][i].validateFields()
          if (!valid) {
            cb && cb(data)
          }
        }
        return Promise.resolve(data)
      } else {
        cb && cb(data)
        return Promise.resolve(data)
      }
    },
    // 转换数据
    transValue() {
      const copy = JSON.parse(JSON.stringify(this.formData))
      this.pickerColumnsAll.forEach((x, index) => {
        Object.keys(x).forEach((key) => {
          if (copy[index][key]) {
            let value
            if (x[key].find((v) => v.children) && x[key].find((v) => v.text)) {
              // 处理级联数据
              x[key].every((item) => {
                value = item.children.find((_) => _.text === copy[index][key])?.value
                return !value
              })
            } else if (copy[index][key] instanceof Array) {
              value = copy[index][key]
                .map((v) => {
                  return x[key].find((_) => _.label === v)?.value
                })
                ?.toString()
            } else {
              value = x[key].find((_) => _.label === copy[index][key])?.value
            }
            copy[index][key] = value
          }
        })
      })
      return copy
    },
    // 点击下拉
    selectClick(panelIndex, formItem) {
      if (formItem.click) {
        const next = (res = true) => {
          if (res) {
            this.showPicker[panelIndex][formItem.prop] = true
          }
        }
        formItem.click(panelIndex, formItem, next)
      } else {
        this.showPicker[panelIndex][formItem.prop] = true
      }
    },
    // 确认选择器
    onConfirm(index, value, item) {
      if (item.type === 'dateTime') {
        this.formData[index][item.prop] = timeFormatter(value, item.formatter || 'yyyy-MM-dd hh:mm:ss')
        item.cb && item.cb(value, this.formData, item)
      } else {
        let newVal = ''
        if (item.type === 'cascader') {
          newVal = value.selectedOptions.slice(-1)[0][item.fieldNames?.text || 'text']
        } else if (Array.isArray(value)) {
          newVal = value[value.length - 1]
        } else {
          newVal = value
        }
        this.formData[index][item.prop] = newVal
        item.cb && item.cb(newVal, this.formData[index], item, value)
      }
      this.showPicker[index][item.prop] = false
    },
    // 时间格式化
    formatter(type, val) {
      if (type === 'year') {
        return val + '年'
      }
      if (type === 'month') {
        return val + '月'
      }
      if (type === 'day') {
        return val + '日'
      }
      return val
    },
    onOversize(maxSize) {
      this.$toast(`文件大小不能超过 ${maxSize / 1024 / 1024}MB`)
    },
    // 文件上传后回调
    afterRead(file, cur, panelIndex, item) {
      file.status = 'uploading'
      file.message = '上传中...'
      const formData = new FormData()
      formData.append('file', file.file)
      const requestApi = item.requestApi || fileUpload
      console.log(file.file, file.file.type, file.file.name, formData, 6666)
      requestApi(formData).then((res) => {
        if (res.success) {
          file.status = 'success'
          file.message = '上传成功'

          if (!Array.isArray(this.formData[panelIndex][item.prop])) {
            this.formData[panelIndex][item.prop] = []
          }
          this.formData[panelIndex][item.prop].push(res.data)
          this.abc = this.formData[panelIndex][item.prop][cur.index].url
        } else {
          file.status = 'failed'
          file.message = '上传失败'
        }
      })
    },
    // 删除文件
    deleteFile(file, cur, panelIndex, item) {
      this.formData[panelIndex][item.prop].splice(cur.index, 1)
      if (this.formData[panelIndex][item.prop].length === 0) {
        this.formData[panelIndex][item.prop] = null
      }
    },
    readonlyInput(type) {
      const input = ['input', 'select', 'radioGroup', 'dateTime', 'cascader']
      const textarea = ['textarea']
      const slot = ['slot']
      const upload = ['upload']
      if (input.includes(type)) {
        return 'input'
      }
      if (textarea.includes(type)) {
        return 'textarea'
      }
      if (slot.includes(type)) {
        return 'slot'
      }
      if (upload.includes(type)) {
        return 'upload'
      }
    },
    preview(list, index) {
      ImagePreview({
        images: list.map((v) => (typeof v === 'string' ? v : v.url)),
        startPosition: index
      })
    },
    onPreview(file, cur, panelIndex, formItem) {
      this.currentVideoUrl = ''
      this.currentAudioUrl = ''
      const type = file.file.type
      console.log(type, 'type', this.formData[panelIndex][formItem.prop][cur.index].path, 'path')
      console.log(process.env.VUE_APP_FILE + this.formData[panelIndex][formItem.prop][cur.index].path, 'allPath')
      // 用安卓方法调用时不能用相对路径，必须拼全路径
      if (type.includes('image/')) {
        // 图片
        // this.$cci.play({
        //   url: process.env.VUE_APP_FILE + this.formData[panelIndex][formItem.prop][cur.index].path,
        //   type: 'picture'
        // })
        // app的方法展示图片会报错，暂时不用
        return false
      } else if (type.includes('video/')) {
        // 视频
        this.$cci.play({
          url: process.env.VUE_APP_FILE + this.formData[panelIndex][formItem.prop][cur.index].path,
          type: 'video'
        })
      } else if (type.includes('audio/')) {
        // 音频
        this.$cci.play({
          url: process.env.VUE_APP_FILE + this.formData[panelIndex][formItem.prop][cur.index].path,
          type: 'audio'
        })
      } else {
        // 下载
        window.open(process.env.VUE_APP_FILE + this.formData[panelIndex][formItem.prop][cur.index].path)
      }
    },
    touchStart(formData, prop) {
      this.$cci.speech2Text((text) => {
        console.log(text, '语音内容')
        formData[prop] = text
      })
    }
  }
}
</script>

<style scoped lang="scss">
.myFormContainer {
  .formContainer {
    .f-title {
      height: 42px;
      line-height: 42px;
      font-size: 18px;
      padding: 0 16px;
      font-weight: 600;
      color: #333;
      background-color: transparent;
    }
  }

  :deep(.van-field) {
    .van-field__label {
      font-size: 16px;
      font-weight: 400;
      color: #333333;
      line-height: 24px;
    }

    .van-field__word-limit {
      color: #999990;
    }

    .van-icon-arrow {
      font-size: 6px;
    }
  }
}

.formItem {
  position: relative;
  padding: 0 6px;
  background-color: #fff;

  .borderLine {
    position: absolute;
    left: 14px;
    right: 14px;
    width: 90%;
    height: 2px;
    bottom: 0;
    border-bottom: 1px solid #f5f5f5;
    z-index: 111;
  }
}

.van-uploader {
  padding-top: 8px;
}

.rightSlot {
  display: flex;
}
.van-image {
  margin-right: 10px;
}
</style>
<style lang="scss">
.van-field--disabled .van-field__label {
  color: #646566 !important;
}

.readOnlyModel {
  .van-field__label {
    color: #999 !important;
  }

  .van-field__control:disabled {
    color: #333 !important;
    -webkit-text-fill-color: #333 !important;
  }
}

.preview-overlay {
  background: rgba(0, 0, 0, 0.9);

  .preview-wrapper {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100%;

    .my-video {
      max-width: 80%;
      height: 50vh;
    }
  }
}
</style>
