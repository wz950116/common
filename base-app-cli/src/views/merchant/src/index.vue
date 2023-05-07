<template>
  <div class="merchant basePage">
    <cmb-sticky>
      <cmb-tabs
        v-model="state.status"
        color="#0482FF"
        title-active-color="#0482FF"
        @click="tabClick"
      >
        <cmb-tab title="已录入" :name="0"></cmb-tab>
        <cmb-tab title="待确认" :name="1"></cmb-tab>
        <cmb-tab title="已确认" :name="2"></cmb-tab>
        <cmb-tab title="已变更" :name="3"></cmb-tab>
        <cmb-tab title="已作废" :name="4"></cmb-tab>
        <cmb-tab title="所有商户" :name="5"></cmb-tab>
      </cmb-tabs>
    </cmb-sticky>
    <cmb-search
      v-model="state.storeName"
      show-action
      placeholder="请输入商户名称"
      @search="onRefresh"
    >
      <template #action>
        <cmb-icon name="filter-o" class="search-filter" @click="openSearch" />
      </template>
    </cmb-search>
    <cmb-pull-refresh v-if="state.list.length" v-model="state.refreshing" @refresh="onRefresh">
      <cmb-list
        class="list"
        v-model="state.loading"
        :finished="state.finished"
        finished-text="没有更多了"
        @load="onLoad"
      >
        <div
          class="list-item"
          v-for="item in state.list"
          :key="item.id"
          @click="toDetail(item)"
        >
          <div class="list-item-title">{{ item.storeName }}</div>
          <div>经营类型：{{ item.storeTypeDesc }}</div>
          <div>经营状态：{{ item.operationStatusDesc }}</div>
          <div>商户地址：{{ item.address }}</div>
          <div>创建时间：{{ item.createTime }}</div>
          <div :class="['tag', 'tag-' + item.status]">{{ ['已录入', '待确认', '已确认', '已变更', '已作废'][item.status] }}</div>
        </div>
      </cmb-list>
    </cmb-pull-refresh>
    <cmb-empty v-else description="暂无数据" />
    <div class="button-list">
      <div class="button" @click="onAdd">新增</div>
    </div>
    <!-- 查询条件 -->
    <search-dialog ref="mySearch" @openMethod="getOpenMethod" @confirm="onSearch"></search-dialog>
  </div>
</template>

<script setup>
/* eslint-disable no-unused-vars */
import { reactive, ref, onMounted } from 'vue'
import { Toast } from '@cci/mcui'
import { useRoute, useRouter } from '@/utils/vueApi'
import { findStoreBaseListByPage } from '../store'
import { mutations } from '@/directive/keepAlive'
import searchDialog from './search'
const route = useRoute()
const router = useRouter()

onMounted(() => {
  // 初始化清除编辑页缓存
  mutations.delPageName('merchantEdit')
  onRefresh()
})

const subRouter = ref({})
let searchOpen = ref()
const state = reactive({
  storeName: '',
  status: 0,
  loading: false,
  refreshing: false,
  finished: true,
  total: 0,
  pageNum: 1,
  pageSize: 10,
  list: [],
  searchOption: {}
})

// 列表请求
const initData = async() => {
  try {
    state.loading = true
    const { data, success, message } = await findStoreBaseListByPage({
      ...state.searchOption,
      pageNum: state.pageNum,
      pageSize: state.pageSize,
      status: state.status === 5 ? '' : state.status * 1,
      storeName: state.storeName
    })
    if (success) {
      state.list = state.list.concat(data.list || [])
      state.total = data.total
    } else {
      Toast.fail(message)
    }
  } finally {
    state.loading = false
    state.refreshing = false
  }
}
// 加载更多
const onLoad = async() => {
  if (state.list.length < state.total) {
    state.pageNum += 1
    initData()
  } else {
    state.finished = true
  }
}
// 下拉刷新
const onRefresh = async() => {
  state.refreshing = true

  // 清空列表数据
  state.finished = false
  state.list = []
  state.pageNum = 1

  // 重新加载数据
  initData()
}
// 打开查询条件弹窗
const openSearch = () => {
  searchOpen(state.searchOption)
}
// 关闭查询条件
const onSearch = (params) => {
  state.searchOption = params
  onRefresh()
}
// 新增
const onAdd = () => {
  router.push({
    path: '/merchant/add'
  })
}
// 查看
const toDetail = ({ id }) => {
  router.push({
    path: '/merchant/view',
    query: {
      id
    }
  })
}
const getOpenMethod = (method) => {
  searchOpen = method
}
const tabClick = (name) => {
  state.status = name
  onRefresh()
}
</script>

<style lang="scss" scoped>
.merchant {
  height: 100%;
  .search-filter {
    font-size: 18px;
    font-weight: 500;
  }
  .list {
    height: calc(100vh - 225px);
    margin: 12px;
    overflow-y: auto;
    &-item {
      position: relative;
      padding: 8px 14px;
      margin-bottom: 12px;
      border-radius: 8px;
      background: #ffffff;
      overflow: hidden;
      line-height: 32px;
      font-size: 14px;
      font-family: PingFangSC, PingFangSC-Regular;
      color: #666666;
      &-title {
        font-size: 18px;
        font-weight: 500;
        font-family: PingFangSC, PingFangSC-Medium;
        color: #333333;
      }
      &:last-of-type {
        margin-bottom: 0;
      }
      .tag {
        position: absolute;
        right: 14px;
        top: 0;
        width: 52px;
        height: 24px;
        line-height: 24px;
        text-align: center;
        background: #0482FF;
        border-radius: 0px 0px 4px 4px;
        font-size: 12px;
        color: #ffffff;
        &-1 {
          background: #F4C758;
        }
        &-2 {
          background: #33CDB5;
        }
        &-3 {
          background: #FF7385;
        }
        &-4 {
          background: #999999;
        }
      }
    }
  }
  ::v-deep .van-tabs__line {
    bottom: 0;
  }
  ::v-deep .van-tabs__nav--line {
    padding-bottom: 0;
  }
  .button-list {
    div {
      position: absolute;
      bottom: 12px;
      left: 12px;
      right: 12px;
      height: 48px;
      line-height: 48px;
      text-align: center;
      background: #0482FF;
      font-size: 18px;
      color: #ffffff;
      border-radius: 8px;
    }
  }
}
</style>
