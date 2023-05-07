<template>
  <div class="merchant basePage">
    <cmb-sticky>
      <cmb-tabs
        v-model="state.status"
        color="#0482FF"
        title-active-color="#0482FF"
        @click="tabClick"
      >
        <cmb-tab title="门前五包信息统计" :name="0"></cmb-tab>
        <cmb-tab title="门前五包案件统计" :name="1"></cmb-tab>
      </cmb-tabs>
    </cmb-sticky>
    <div class="search">
      <cmb-search v-model="state.storeName" show-action placeholder="请输入商户名称" @search="onRefresh">
        <template #action>
          <div @click="onReset">重置</div>
        </template>
      </cmb-search>
      <field-picker v-model="state.districtName" label="所属区县" valueKey="cityCommunityName" code="cityCommunityId" opType="edit" :columns="state.areaColumns" placeholder="" @changeall="onAreaChange"></field-picker>
      <field-picker v-model="state.streetName" label="所属街道" valueKey="cityCommunityName" code="cityCommunityId" opType="edit" :columns="state.streetColumns" placeholder="" @changeall="onStreetChange"></field-picker>
      <cmb-field v-if="state.status===1" v-model="state.date" label="统计时间" right-icon="arrow" input-align="right" readonly placeholder="请选择时间段" @click="state.showPicker = true" />
      <cmb-calendar v-model="state.showPicker" :default-date="state.defaultDate" type="range" :min-date="state.minDate" clearable @confirm="onConfirm" />
    </div>
    <cmb-pull-refresh v-if="state.list.length" v-model="state.refreshing" @refresh="onRefresh">
      <cmb-list
        class="list"
        v-model="state.loading"
        :finished="state.finished"
        finished-text="没有更多了"
        @load="onLoad"
      >
      <div v-if="!state.status">
        <div
          class="list-infoItem"
          v-for="item in state.list"
          :key="item.id"
        >
          <div class="list-infoItem-sign">{{ item.levelDesc }}</div>
          <div class="list-infoItem-title">{{ item.storeName }}</div>
          <cmb-row>
            <cmb-col span="8"><span>{{ item.storeTotalNum }}</span><p>案件总数（件）</p></cmb-col>
            <cmb-col span="8"><span>{{ item.storeSelfNum }}</span><p>商户自治（件）</p></cmb-col>
            <cmb-col span="8"><span>{{ item.storeDigitalNum }}</span><p>执法（件）</p></cmb-col>
            <cmb-col span="24" class="list-infoItem-address">
              <cmb-icon name="location-o" class="search-filter" />
              {{ item.areaInfo }}
            </cmb-col>
          </cmb-row>
        </div>
      </div>
      <div v-else>
        <div
          class="list-item"
          v-for="item in state.list"
          :key="item.id"
        >
          <div class="list-item-title">{{ item.storeName }}</div>
          <cmb-row>
            <cmb-col span="24">{{ item.areaInfo }}</cmb-col>
            <cmb-col v-for="i in item.typeStats" :key="i.code" span="12">{{ i.name }}：<span>{{ i.number }}</span></cmb-col>
          </cmb-row>
        </div>
      </div>
      </cmb-list>
    </cmb-pull-refresh>
    <cmb-empty v-else description="暂无数据" />
  </div>
</template>

<script setup>
/* eslint-disable no-unused-vars */
import { reactive, ref, onMounted } from 'vue'
import { Toast } from '@cci/mcui'
import { timeFormatter } from '@/utils'
import { useRouter } from '@/utils/vueApi'
import FieldPicker from '@/components/FieldPicker'
import { statsStoreBaseListByPage, caseStoreBaseListByPage } from '../store'
import { queryCityCommunity } from '@/api'

onMounted(() => {
  router = useRouter()
  const year = new Date().getFullYear()
  const month = new Date().getMonth()
  const lastDay = new Date(year, month + 1, 0).getDate()
  const start = new Date(year, month, 1)
  const end = new Date(year, month, lastDay)
  state.defaultDate = [start, end]
  state.timeBegin = timeFormatter(start)
  state.timeEnd = timeFormatter(end)
  state.date = `${timeFormatter(start, 'yyyy-MM-dd')} - ${timeFormatter(end, 'yyyy-MM-dd')}`
  // 初始化请求
  onRefresh()
  queryCityCommunity({ type: 'district' }).then(({ data, success }) => {
    if (success) {
      state.areaColumns = data
    }
  })
})

let router = ref(null)
const state = reactive({
  loading: false,
  refreshing: false,
  finished: true,
  total: 0,
  pageNum: 1,
  pageSize: 10,
  list: [],
  storeName: '',
  districtName: '',
  districtCode: '',
  streetName: '',
  streetCode: '',
  areaColumns: [],
  streetColumns: [],
  showPicker: false,
  timeBegin: '',
  timeEnd: '',
  date: '',
  defaultDate: [],
  minDate: new Date(2010, 0, 1),
  infoList: [
    {
      id: 1,
      text: '案件总数(件)',
      num: 10
    },
    {
      id: 2,
      text: '商户自治(件)',
      num: 23
    },
    {
      id: 3,
      text: '执法(件)',
      num: 66
    }
  ]
})

const initData = async() => {
  try {
    state.loading = true
    if (state.status) {
      const { data, success, message } = await statsStoreBaseListByPage({
        pageNum: state.pageNum,
        pageSize: state.pageSize,
        storeName: state.storeName,
        timeBegin: state.timeBegin,
        timeEnd: state.timeEnd,
        districtCode: state.districtCode,
        streetCode: state.streetCode
      })
      if (success) {
        state.list = state.list.concat(data.list || [])
        state.total = data.total
      } else {
        Toast.fail(message)
      }
    } else {
      const { data, success, message } = await caseStoreBaseListByPage({
        pageNum: state.pageNum,
        pageSize: state.pageSize,
        storeName: state.storeName,
        districtCode: state.districtCode,
        streetCode: state.streetCode
      })
      if (success) {
        state.list = state.list.concat(data.list || [])
        state.total = data.total
      } else {
        Toast.fail(message)
      }
    }
  } finally {
    state.loading = false
    state.refreshing = false
  }
}
const onLoad = async() => {
  if (state.list.length < state.total) {
    state.pageNum += 1
    initData()
  } else {
    state.finished = true
  }
}
const onRefresh = async() => {
  state.refreshing = true

  // 清空列表数据
  state.finished = false
  state.list = []
  state.pageNum = 1

  // 重新加载数据
  initData()
}
const onAreaChange = val => {
  state.districtName = val.cityCommunityName
  state.districtCode = val.cityCommunityId
  state.streetName = ''
  state.streetCode = ''
  onRefresh()
  queryCityCommunity({ type: 'street', communityParentId: state.districtCode }).then(({ data, success }) => {
    if (success) {
      state.streetColumns = data
    }
  })
}
const onStreetChange = val => {
  state.streetName = val.cityCommunityName
  state.streetCode = val.cityCommunityId
  onRefresh()
}
const onConfirm = (date) => {
  const [start, end] = date
  state.showPicker = false
  state.timeBegin = timeFormatter(start)
  state.timeEnd = timeFormatter(end)
  state.date = `${timeFormatter(start, 'yyyy-MM-dd')} - ${timeFormatter(end, 'yyyy-MM-dd')}`
  onRefresh()
}
const onReset = () => {
  state.storeName = ''
  state.districtName = ''
  state.districtCode = ''
  state.streetName = ''
  state.streetCode = ''
  state.streetColumns = []
  const start = state.defaultDate[0]
  const end = state.defaultDate[1]
  state.timeBegin = timeFormatter(start)
  state.timeEnd = timeFormatter(end)
  state.date = `${timeFormatter(start, 'yyyy-MM-dd')} - ${timeFormatter(end, 'yyyy-MM-dd')}`
  onRefresh()
}

const tabClick = (name) => {
  state.status = name
  onRefresh()
}
</script>

<style lang="scss" scoped>
.merchant {
  height: 100%;
  .list {
    height: calc(100vh - 158px);
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
      .van-col {
        span {
          color: #0482FF;
        }
      }
      &:last-of-type {
        margin-bottom: 0;
      }
    }
    &-infoItem {
      background: #ffffff;
      border-radius: 8px;
      box-shadow: 0px 2px 6px 0px #ffffff;
      margin-bottom: 12px;
      padding: 12px 14px 0;
      overflow: hidden;
      line-height: 32px;
      font-size: 14px;
      position: relative;
      color: #666;
      &-title {
        font-size: 16px;
        font-family: PingFang SC, PingFang SC-Medium;
        font-weight: 500;
        color: #333333;
        line-height: 24px;
      }
      &-sign {
        position: absolute;
        right: 14px;
        top: 0;
        line-height: 24px;
        background: #0482ff;
        border-radius: 0px 0px 4px 4px;
        padding: 0 8px;
        font-size: 12px;
        color: #ffffff;
      }
      .van-col {
        padding: 14px 0;
        text-align: center;
        &:nth-child(2) {
          span {
            color: #FF8F33;
          }
        }
        &:nth-child(3) {
          span {
            color: #FF5167;
          }
        }
        span {
          color: #0482FF;
          font-size: 18px;
          line-height: 26px;
        }
        p {
          margin: 0;
        }
      }
      .list-infoItem-address {
        text-align: left;
        border-top: 1px solid #ebebeb;
        line-height: 46px;
        padding: 0;
      }
    }
  }
  :deep(.van-calendar) {
    font-size: 16px;
  }
}
</style>
