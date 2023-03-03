<!-- 列表自动滚动 -->
<template>
  <div class="list" id="printBox">
    <div class="list-item">
      <!-- content -->
    </div>
  </div>
</template>
<script setup>
/* eslint-disable no-unused-vars */
import { reactive, nextTick, onMounted, onBeforeUnmount } from 'vue'

onMounted(() => {
  getEventList()
})
onBeforeUnmount(() => {
  // 组件卸载前
  clearInterval(timer.scrollTimer)
})
const timer = reactive({
  scrollTimer: null, // 滚动定时器
  pauseTimer: null // 暂停定时器
})
const getEventList = async () => {
  // http请求
  await nextTick()
  // 开始滚动
  autoScroll()
}
// 初始化
const autoScroll = () => {
  const printBoxDom = document.getElementById('printBox')
  const scrollHeight = printBoxDom.scrollHeight
  const clientHeight = printBoxDom.clientHeight
  const scroll = scrollHeight - clientHeight
  // 滚动长度为0
  if (scroll === 0) {
    return
  }
  // 触发滚动方法
  scrollFun()
  printBoxDom.onmouseover = () => {
    // 鼠标放上
    pauseScroll(false)
  }
  printBoxDom.onmouseout = () => {
    // 鼠标离开
    pauseScroll(true)
  }
}
const pauseScroll = (state) => {
  if (state) {
    scrollFun()
  } else {
    clearInterval(timer.scrollTimer)
    timer.scrollTimer = null
  }
}
const scrollFun = () => {
  const printBoxDom = document.getElementById('printBox')
  // 如果定时器存在则先清除
  if (timer.scrollTimer) {
    clearInterval(timer.scrollTimer)
    timer.scrollTimer = null
  }
  timer.scrollTimer = setInterval(() => {
    const scrollHeight = printBoxDom.scrollHeight
    const clientHeight = printBoxDom.clientHeight
    const scroll = scrollHeight - clientHeight
    // 获取当前滚动条距离顶部高度
    const scrollTop = printBoxDom.scrollTop
    // 滚动速度
    const temp = scrollTop + 2
    printBoxDom.scrollTop = temp // 滚动
    // 是否滚动到最底部
    if (Number(scroll) <= Number(temp)) {
      clearInterval(timer.scrollTimer)
      timer.scrollTimer = null
      setTimeout(() => {
        printBoxDom.scrollTop = 0
        autoScroll()
      }, 100)
    }
  }, 80)
}
</script>
