<template>
  <div>
    <el-input v-model="abc"></el-input>
    <div style="overflow:hidden;">
      <div class="far" style="width:100px;height:100px;background:yellow;margin-bottom:100px;">
      </div>
    </div>
    <div>
      <div class="child" style="width:100px;height:100px;background:red;margin-top:100px;"></div>
    </div>
    <div>
      <span style="background:red;padding:10px;">1111111111111</span>
      <img src="" alt="111" title="222">
      <button @click="increment">Count: {{ count }}</button>
    </div>
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
import { abb } from './demo'
console.log(abb)
setTimeout(() => {
  console.log(abb)
}, 4000)
export default {
  name: '',
  data() {
    // 使用闭包来创建一个私有的count变量
    let count = 0
    return {
      abc: 1111,
      increment: () => ++count, // 内部方法可以访问闭包中的count变量
      item: [1, 2, 3, 4, 5, 6],
      a: '成都草草草草草草草000\n111111111111111草成都草草草草草草草草成都草草222222222222222草草草草草222222\n....草成都草草草草草草草草------<br>+++++++++++成都草草草草草草草草成都草草草草草草草草'
    }
  },
  computed: {
    // 在计算属性中暴露只读的count值
    count() {
      console.log(this.increment)
      return this.increment
    }
  },
  mounted() {},
  methods: {
    onClick() {
      this.$router.push({
        // path: '/render-tmp/1111',
        name: 'renderTmp',
        params: { id: 11 }
      })
      // this.item.push(4)
      // this.item[2] = 100
      // this.$set(this.item, 2, 100)
      // this.item.splice(2, 1, 100)
    }
  }
}
</script>

<style lang='scss' scoped>
.square {
  width: 10vw;
  height: 10vw;
  background: red;
}
.square {
  width: 10%;
  padding-bottom: 10%;
  height: 0; // 防止内容撑开多余的高度
  background: red;
}
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
