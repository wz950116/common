<template>
	<view class="uni_content">
		<u-tabs class="status-tabs" :list="tableList" :is-scroll="false" :current="current" @change="tabChange">
		</u-tabs>
		<view class="store-search">
			<u-search bg-color="#FFF" shape="square" @change="searchList" @clear="clearList" placeholder="请输入商户信息"
				v-model="mixedWord" :show-action="false"></u-search>
		</view>
		<view v-if="isRelate">
			<view v-if="list.length">
				<view class="store-list">
					<view class="store-list-item" v-for="item in list" :key="item.id" @click="cilckDetail(item)">
						<view class="store-list-item-title">{{ item.storeName }}</view>
						<view>{{ item.caseDesc }}</view>
						<view class="store-list-item-address">上报时间：{{ item.createTime }}</view>
						<view :class="['tag', 'tag-' + item.manageType]">{{ item.manageTypeName }}</view>
					</view>
				</view>
				<view class="uni_loadmore">
					<u-loadmore :status="status" :icon-type="iconType" :load-text="loadText" />
				</view>
			</view>
			<view class="empty-tip" v-else>
				<img class="empty-icon" :src="require('../../static/event_issue_empty.png')" alt="">
				<view class="tip-title">暂无内容</view>
				<view class="tip-content">您的商铺暂无需要整改的地方，请继续保持哦</view>
			</view>
		</view>
		<view class="no-result" v-else>
			<img class="empty-icon" :src="require('../../static/event_issue_unrelated.png')" alt="">
			<view class="info">未关联商铺</view>
			<view class="sub-info">您的账号未关联平台商铺，可点击下方按钮进行认领或登记</view>
			<view class="btn-list">
				<u-button @click="onStoreDJ">商户登记</u-button>
				<u-button type="primary" @click="onStoreRL">商户认领</u-button>
			</view>
		</view>
	</view>
</template>
<script>
	export default {
		data() {
			return {
				isRelate: true, // 登陆人是否关联平台商铺
				isNoMore: false,
				mixedWord: '',
				pageSize: 10,
				pageNum: 1,
				list: [],
				status: 'loadmore',
				iconType: 'flower',
				current: 0,
				handleType: 1,
				isHandle: 0,
				loadText: {
					loadmore: '轻轻下拉',
					loading: '努力加载中',
					nomore: '没有更多了'
				},
				tableList2: ['待反馈', '已反馈', '执法'],
				tableList: [{
					name: '待反馈'
				}, {
					name: '已反馈'
				}, {
					name: '执法'
				}]
			}
		},
		onReachBottom() {
			if (!this.isNoMore) {
				this.pageNum++
				this.getStoreBaseList(this.pageNum, this.pageSize, this.mixedWord)
			}
		},
		onPullDownRefresh() {
			uni.startPullDownRefresh()
			this.reset()
			this.getStoreBaseList(this.pageNum, this.pageSize, this.mixedWord)
		},
		onLoad(option) {
			console.log(option)
			this.$u.api.getStoreBaseList({
				claimId: getApp().globalData.userId
			}).then(({
				data
			}) => {
				if (Number(data.total)) {
					this.isRelate = true
					// 判断是否从处置页面跳转过来
					if (option.tabIndex) {
						this.tabChange(option.tabIndex * 1)
					} else {
						this.init()
					}
				} else {
					this.isRelate = false
				}
			})
		},
		methods: {
			init() {
				this.getStoreBaseList(this.pageNum, this.pageSize)
			},
			getStoreBaseList(pageNum, pageSize, mixedWord) {
				this.$u.api.findStoreCaseListByPage({
					pageNum,
					pageSize,
					mixedWord,
					handleType: this.handleType,
					isHandle: this.isHandle,
					claimId: getApp().globalData.userId
				}).then(({
					data,
					success
				}) => {
					if (success) {
						this.list = this.list.concat(data.list || [])
						uni.stopPullDownRefresh()
						if (data.list.length < pageSize) {
							this.status = this.loadText.loadmore
							this.isNoMore = true
						}
					}
				})
			},
			tabChange(e) {
				this.current = e
				if (this.current === 0) {
					this.handleType = 1
					this.isHandle = 0
				} else if (this.current === 1) {
					this.handleType = 1
					this.isHandle = 1
				} else {
					this.handleType = 2
					this.isHandle = null
				}
				this.reset()
				this.init()
			},
			reset() {
				this.pageNum = 1
				this.pageSize = 10
				this.mixedWord = ''
				this.isNoMore = false
				this.list = []
			},
			searchList(e) {
				this.pageNum = 1
				this.pageSize = 10
				this.isNoMore = false
				this.list = []
				this.getStoreBaseList(this.pageNum, this.pageSize, e)
			},
			clearList() {
				this.pageNum = 1
				this.pageSize = 10
				this.isNoMore = false
				this.list = []
			},
			cilckDetail(item) {
				uni.navigateTo({
					url: './detail?id=' + item.id
				})
			},
			onStoreDJ() {
				uni.navigateTo({
					url: '../mqwbStoreDJ/index'
				})
			},
			onStoreRL() {
				uni.navigateTo({
					url: '../mqwbStoreRL/index'
				})
			}
		}
	}
</script>
<style lang='scss' scoped>
	.status-tabs {
		position: fixed;
		top: 0;
		width: 100%;
		height: 110rpx;
		background-color: #F7FAFB;
		z-index: 9;
	}

	.store-search {
		position: fixed;
		top: 110rpx;
		width: 702rpx;
		height: 90rpx;
		background-color: #F7FAFB;
		z-index: 9;
	}

	.no-result {
		width: 100%;
		text-align: center;
		margin-top: 290rpx;
		
		.empty-icon {
			display: block;
			width: 160rpx;
			height: 160rpx;
			margin: 0 auto;
		}

		.info {
			font-size: 48rpx;
			font-weight: 500;
			color: #333333;
		}
			
		.sub-info {
			font-size: 30rpx;
			color: #999999;
			margin: 20px 80rpx;
		}

		.btn-list {
			display: flex;
			justify-content: center;
			width: 100%;

			u-button {
				margin: 0 12rpx;
			}
		}
	}

	.store-list {
		width: 702rpx;
		margin-top: 200rpx;
		border-radius: 8rpx;
		overflow-y: auto;

		&-item {
			position: relative;
			padding: 16rpx 28rpx 28rpx;
			margin-bottom: 24rpx;
			border-radius: 16rpx;
			background: #ffffff;
			overflow: hidden;
			line-height: 64rpx;
			font-size: 28rpx;
			font-family: PingFangSC, PingFangSC-Regular;
			color: #666666;
			box-shadow: 0rpx 4rpx 12rpx 0rpx rgba(0, 0, 0, 0.04);

			&-title {
				font-size: 36rpx;
				font-weight: 500;
				font-family: PingFangSC, PingFangSC-Medium;
				color: #333333;
			}

			&-address {
				line-height: 36rpx;
			}

			.icon-location {
				margin-right: 8rpx;
			}

			&:last-of-type {
				margin-bottom: 0;
			}

			.tag {
				position: absolute;
				right: 28rpx;
				top: 28rpx;
				height: 48rpx;
				line-height: 48rpx;
				text-align: center;
				padding: 0 10rpx;
				background: #F4C758;
				border-radius: 8rpx;
				font-size: 24rpx;
				color: #ffffff;
			}
		}
	}

	.uni_loadmore {
		margin-bottom: 28rpx;
	}

	.empty-tip {
		width: 100%;
		text-align: center;
		margin-top: 290rpx;
		line-height: 80rpx;
		
		.empty-icon {
			display: block;
			width: 160rpx;
			height: 160rpx;
			margin: 0 auto;
		}

		.tip-title {
			font-size: 48rpx;
			font-weight: 500;
			color: #333333;
		}

		.tip-content {
			font-size: 30rpx;
			color: #999999;
		}
	}
</style>
