<template>
	<view class="uni_content">
		<view class="store-search">
			<u-search bg-color="#FFF" shape="square" @change="searchList" @clear="clearList" placeholder="请输入商户信息"
				v-model="storeNameAddress" :show-action="false"></u-search>
		</view>
		<view v-if="storeNameAddress">
			<view v-if="list.length">
				<view class="store-list">
					<view class="store-list-item" v-for="item in list" :key="item.id" @click="cilckDetail(item)">
						<view class="store-list-item-title">{{ item.storeName }}</view>
						<view>负责人：{{ item.principal }}</view>
						<view class="store-list-item-address">
							<u-icon class="icon-location" name="map-fill" color="#2979ff" size="28"></u-icon>
							{{ item.address }}
						</view>
						<view :class="['tag', 'tag-' + item.isClaim]">{{ item.isClaimDesc }}</view>
					</view>
				</view>
				<view class="uni_loadmore">
					<u-loadmore :status="status" :icon-type="iconType" :load-text="loadText" />
				</view>
			</view>
			<view class="no-result" v-else>
				<img class="empty-icon" :src="require('../../static/store_rl_unfind.png')" alt="">
				<view class="info">找不到商铺信息</view>
				<view class="sub-info">暂未找到您搜索的商铺信息，可点击下方按钮进行登记</view>
				<view class="btn-list">
					<u-button @click="onBack">返回主页</u-button>
					<u-button type="primary" @click="onStoreDJ">商户登记</u-button>
				</view>
			</view>
		</view>
		<view class="empty-tip" v-else>
			<img class="empty-icon" :src="require('../../static/store_rl_empty.png')" alt="">
			<view class="tip-title">认领商铺</view>
			<view class="tip-content">请输入您的商铺名称或商铺地址进行查询</view>
		</view>
	</view>
</template>
<script>
	export default {
		data() {
			return {
				isNoMore: false,
				storeNameAddress: '',
				pageSize: 10,
				pageNum: 1,
				list: [],
				status: 'loadmore',
				iconType: 'flower',
				loadText: {
					loadmore: '轻轻下拉',
					loading: '努力加载中',
					nomore: '没有更多了'
				}
			}
		},
		onReachBottom() {
			if (!this.isNoMore) {
				this.pageNum++
				this.getStoreBaseList(this.pageNum, this.pageSize, this.storeNameAddress)
			}
		},
		onPullDownRefresh() {
			uni.startPullDownRefresh()
			this.reset()
			this.getStoreBaseList(this.pageNum, this.pageSize, this.storeNameAddress)
		},
		onLoad() {
			this.init()
		},
		methods: {
			init() {
				this.getStoreBaseList(this.pageNum, this.pageSize)
			},
			getStoreBaseList(pageNum, pageSize, storeNameAddress) {
				if (!storeNameAddress) return false
				this.$u.api.getStoreBaseList({
					pageNum,
					pageSize,
					storeNameAddress
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
			reset() {
				this.pageNum = 1
				this.pageSize = 10
				this.storeNameAddress = ''
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
				this.getStoreBaseList(this.pageNum, this.pageSize, this.storeNameAddress)
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
			onBack() {
				uni.navigateBack()
			}
		}
	}
</script>
<style lang='scss' scoped>
	.store-search {
		position: fixed;
		top: 0;
		width: 702rpx;
		height: 90rpx;
		background-color: #F7FAFB;
		z-index: 9;
	}
	
	.no-result {
		width: 100%;
		text-align: center;
		margin-top: 180rpx;
	
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
			margin: 20rpx;
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
		margin-top: 90rpx;
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
				top: 0;
				width: 104rpx;
				height: 48rpx;
				line-height: 48rpx;
				text-align: center;
				background: #0482FF;
				border-radius: 0 0 10rpx 10rpx;
				font-size: 24rpx;
				color: #ffffff;

				&-1 {
					background: #01C1A3;
				}
			}
		}
	}

	.uni_loadmore {
		margin-bottom: 28rpx;
	}

	.empty-tip {
		width: 100%;
		text-align: center;
		margin-top: 250rpx;
		
		.empty-icon {
			display: block;
			width: 160rpx;
			height: 160rpx;
			margin: 0 auto;
		}

		.tip-title {
			font-size: 48rpx;
			font-weight: 500;
			margin: 20rpx;
			color: #333333;
		}

		.tip-content {
			font-size: 30rpx;
			color: #999999;
		}
	}
</style>
