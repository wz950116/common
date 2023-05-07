<template>
  <div class="common-view basePage">
    <cmb-cell-group class="list">
      <cmb-cell
        v-for="item in props.data"
        :key="item.text"
        :class="['list-item', { 'list-item-textarea': item.labelShow }]"
        :title="item.text"
        :value="item.labelShow ? '' : item.value"
      >
        <template v-if="item.labelShow" #label>
          <div v-if="typeof item.label === 'string'">
            {{ item.label }}
          </div>
          <div v-else-if="item.slotName" class="pic-list">
            <slot :name="item.slotName"></slot>
          </div>
          <div v-else class="pic-list">
            <img v-for="(i, index) in item.label" :key="index" :src="i.path" alt="" @click="onPreview(i.path)">
          </div>
        </template>
      </cmb-cell>
    </cmb-cell-group>
  </div>
</template>

<script setup>
/* eslint-disable no-unused-vars */
// {
//   text: '左侧文本String',
//   value: '右侧数值String|Number',
//   key: '唯一标识String',
//   label: '左侧下方数值String',
//   labelShow: '是否显示左侧下方数值Boolean'
// }
// 接收图片列表数据参考[{id: "85", path: "/jz-file/sanitation/2023/03/16/060ab3ae675a4e5cb71e3affcdb57bba.png"}]

import { defineProps } from 'vue'
import { ImagePreview } from '@cci/mcui'

const props = defineProps({
  data: {
    type: Array,
    default: () => []
  }
})

const onPreview = (url) => {
  ImagePreview([url])
}
</script>

<style lang="scss" scoped>
.common-view {
  .list {
    .list-item-textarea {
      .van-cell__value {
        flex: 0;
      }
    }
    .pic-list {
      img {
        width: 72px;
        height: 72px;
        margin-right: 8px;
        border-radius: 4px;
      }
    }
  }
}
</style>
