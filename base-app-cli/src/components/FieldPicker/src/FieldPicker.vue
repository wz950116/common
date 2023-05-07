<template>
  <div :class="['field-picker', { 'field-picker-border': border }]">
    <cmb-field
      name="picker"
      :value="newValue"
      :label="label"
      :placeholder="placeholder"
      :readonly="readonly"
      :clickable="clickable"
      :right-icon="opType === 'edit' ? 'arrow' : ''"
      :rules="rules"
      :required="required"
      :input-align="align"
      @click="showPopup"
    ></cmb-field>
    <cmb-popup v-model="showPicker" position="bottom">
      <cmb-picker
        ref="vanPicker"
        show-toolbar
        :columns="columns"
        :value-key="valueKey"
        @confirm="onConfirm"
        @cancel="showPicker = false"
      >
        <template v-if="columnsTop" slot="columns-top">
          <slot name="columnsTop"></slot>
        </template>
      </cmb-picker>
    </cmb-popup>
  </div>
</template>

<script>
export default {
  model: {
    prop: 'value',
    event: 'change'
  },
  props: {
    value: {
      type: [String, Number],
      default: ''
    },
    // 提交字段
    code: {
      type: String,
      default: 'id'
    },
    // 展示字段
    valueKey: {
      type: String,
      default: 'text'
    },
    columns: {
      type: Array,
      default() {
        return []
      }
    },
    label: {
      type: String,
      default: ''
    },
    readonly: {
      type: Boolean,
      default: true
    },
    clickable: {
      type: Boolean,
      default: true
    },
    isLink: {
      type: Boolean,
      default: true
    },
    // 是否是传入code需要遍历找到name，一般用于查看回显
    valueToLabel: {
      type: Boolean,
      default: false
    },
    opType: {
      type: String,
      default: ''
    },
    required: {
      type: Boolean,
      default: false
    },
    rules: {
      type: Array,
      default() {
        return []
      }
    },
    border: {
      type: Boolean,
      default: true
    },
    align: {
      type: String,
      default: 'right'
    },
    columnsTop: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      showPicker: false,
      newValue: this.value
    }
  },
  computed: {
    vanPickerRef() {
      return this.$refs.vanPicker
    },
    placeholder() {
      return this.opType === 'edit' ? '请选择' + this.label : ''
    }
  },
  watch: {
    value: {
      handler(newValue) {
        if (this.valueToLabel && newValue) {
          this.newValue = this.columns.find((v) => v[this.code] === newValue)[this.valueKey]
        } else {
          this.newValue = newValue
        }
      },
      immediate: true
    }
  },
  methods: {
    showPopup() {
      if (this.opType === 'edit') {
        this.showPicker = true
        this.$nextTick(() => {
          // 打开选中当前值
          this.vanPickerRef.setValues([this.newValue])
        })
      }
    },
    onConfirm(data) {
      const params = data instanceof Array ? data.slice(-1)[0] : data[this.valueKey]
      this.$emit('change', params)
      this.$emit('changeval', data[this.code])
      this.$emit('changeall', data)
      this.showPicker = false
    }
  }
}
</script>

<style lang="scss" scoped>
.field-picker-border {
  position: relative;
  &::after {
    position: absolute;
    box-sizing: border-box;
    content: ' ';
    pointer-events: none;
    right: 16px;
    bottom: 0;
    left: 16px;
    border-bottom: 1px solid #ebedf0;
    transform: scaleY(0.5);
  }
}
</style>
