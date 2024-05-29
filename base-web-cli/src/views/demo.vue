<template>
  <div>
    <div v-for="i in item" :key="i">{{ i }}</div>
    <el-button @click="onClick">click</el-button>
    <div class="elem ml-ellipsis">
      对于一些突然出现滚动条的页面，可能会产生左右抖动的不良影响。在一个滚动容器里，打开弹窗就隐藏滚动条，关闭弹窗就显示滚动条，来回操作会让屏幕抖动起来。提前声明滚动容器的padding-right为滚动条宽度，就能有效消除这个不良影响。
    </div>
    <div class="one-pixel-border"></div>
    <div class="line">1111111111111</div>
    <div class="aaaaa" v-html="a"></div>
    <div class="auto-wrap">
      这是一段很长的文本，它将在容器11111111111111111111111111111111111111122222222222222的宽度限制内自3333333333333333333333333动换行，即使单词非常4444444444长，也会进行断555555.........................词换行。
    </div>
  </div>
</template>

<script>
export default {
  name: '',
  data() {
    return {
      item: [1, 2, 3, 4, 5, 6],
      a: '成都草草草草草草草000\n111111111111111草成都草草草草草草草草成都草草222222222222222草草草草草222222\n....草成都草草草草草草草草------<br>+++++++++++成都草草草草草草草草成都草草草草草草草草'
    }
  },
  mounted() {},
  methods: {
    onClick() {
      this.item.push(4)
      // this.item[2] = 100
      // this.$set(this.item, 2, 100)
      // this.item.splice(2, 1, 100)
    }
  }
}
</script>

<style lang='scss' scoped>
button,
input,
select,
textarea {
  appearance: none;
  /* 自定义样式 */
}
.line {
  width: 500px;
  height: 500px;
  line-height: 500px;
  border: 20px solid;
  background: red url('../assets/images/2.png') no-repeat center/contain;
  margin-bottom: 20px;
  /* box-sizing: border-box; */
}
.aaaaa {
  width: 300px;
  height: 300px;
  border: 1px solid;
  background: red;
  overflow: auto;
  white-space: pre-line;
  margin-bottom: 20px;
  padding: 10px;
  /* box-sizing: border-box; */
}
.auto-wrap {
  width: 300px;
  height: 300px;
  border: 1px solid;
  background: red;
  word-break: break-all;
  /* word-break: break-word; 兼容性差*/
  /* word-wrap: break-word; */
  /* overflow-wrap: break-word; 兼容性差*/
}
.one-pixel-border {
  width: 200px;
  height: 200px;
  border: 1px solid black; /* 设置一像素的黑色实线边框 */
  box-sizing: border-box; /* 确保边框不会导致元素尺寸变化 */
}
.elem {
  width: 200px;
  height: 200px;
  line-height: 40px;
  font-size: 20px;
  background: red;
  padding: 10px;
  &.sl-ellipsis {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  &.ml-ellipsis {
    display: -webkit-box;
    overflow: hidden;
    text-overflow: ellipsis;
    -webkit-line-clamp: 5;
    -webkit-box-orient: vertical;
  }
}
</style>
