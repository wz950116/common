<template>
	<view class="uni_content">
		<view v-if="isRelate">
			<u-swiper class="banner" :list="detailList.storePhotoPaths" name="path" img-mode="aspectFit"></u-swiper>
			<view class="detail_box uni_shadow-border">
				<view class="box-current">
					<view class="my-select">
						<view class="store-name">
							<view>{{ detailList.storeName }}</view>
							<img class="qrcode" :src="require('../../static/erweima.png')" alt="" @click="showQrcode">
						</view>
						<u-icon name="arrow-down-fill" @click="showStoreType = true"></u-icon>
						<u-select v-model="showStoreType" height="560rpx" :safe-area-inset-bottom="true"
							label-name="storeName" value-name="id" :list="storeList" @confirm="onStoreSelect">
						</u-select>
					</view>
				</view>
				<u-line color="#EBEBEB"></u-line>
				<view class="box-current">
					<view class="text-left">
						经营状态
					</view>
					<view class="text-right">
						{{detailList.operationStatusDesc}}
					</view>
				</view>
				<u-line color="#EBEBEB"></u-line>
				<view class="box-current">
					<view class="text-left">
						负责人
					</view>
					<view class="text-right">
						{{detailList.principal}}
					</view>
				</view>
				<u-line color="#EBEBEB"></u-line>
				<view class="box-current">
					<view class="text-left">
						联系电话
					</view>
					<view class="text-right">
						{{detailList.principalTel}}
					</view>
				</view>
				<u-line color="#EBEBEB"></u-line>
				<view class="box-current">
					<view class="text-left">
						所属区域
					</view>
					<view class="text-right">
						{{detailList.areaInfo}}
					</view>
				</view>
				<u-line color="#EBEBEB"></u-line>
				<view class="box-current">
					<view class="text-left">
						详细地址
					</view>
					<view class="text-right">
						{{detailList.address}}
					</view>
				</view>
			</view>
			<view class="statistics">
				<view class="statistics-item">
					<view class="statistics-item-num one">{{ statsList.storeTotalNum }}</view>
					<view class="statistics-item-name">案件总数</view>
				</view>
				<view class="statistics-item">
					<view class="statistics-item-num two">{{ statsList.storeSelfNum }}</view>
					<view class="statistics-item-name">商户自治</view>
				</view>
				<view class="statistics-item">
					<view class="statistics-item-num three">{{ statsList.storeDigitalNum }}</view>
					<view class="statistics-item-name">执法</view>
				</view>
			</view>
			<view class="btn-list">
				<u-button type="primary" @click="handleSubmit">修改</u-button>
			</view>
		</view>
		<view class="no-result" v-else>
			<img class="empty-icon" :src="require('../../static/event_issue_unrelated.png')" alt="">
			<view class="info">未关联商铺</view>
			<view class="sub-info">您的账号未关联平台商铺，可点击下方按钮进行认领或登记</view>
			<view class="btn-list">
				<u-button type="primary" @click="onStoreRL">商户认领</u-button>
				<u-button @click="onStoreDJ">商户登记</u-button>
			</view>
		</view>
	</view>
</template>
<script>
	export default {
		data() {
			return {
				isRelate: false,
				showStoreType: false,
				detailList: {
					qrCodePaths: [],
					storePhotoPaths: []
				},
				statsList: {},
				storeList: []
			}
		},
		methods: {
			onStoreSelect(val) {
				const { value } = val[0]
				this.detailList = this.storeList.find(v => v.id === value)
				this.pathFormat()
				this.getStats(value)
			},
			getStats(id) {
				this.$u.api.statsByStoreId({
					storeId: id
				}).then(({ data, success }) => {
					if (success) {
						this.statsList = data
					}
				})
			},
			showQrcode() {
				const { storeName, qrCodePaths, id } = this.detailList
				uni.navigateTo({
					url: `./qrcode?name=${storeName}&qrCode=${qrCodePaths[0]?.path}&id=${id}`
				})
			},
			pathFormat() {
				this.detailList.storePhotoPaths = this.detailList.storePhotoPaths.map(item => {
					return {
						path: item.path.includes(getApp().globalData.mqwbFileUrl) ? item.path : (getApp().globalData.mqwbFileUrl + item.path)
					}
				})
			},
			handleSubmit() {
				const { id } = this.detailList
				uni.navigateTo({
					url: `./detail?id=${id}`
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
		},
		onShow() {
			this.$u.api.getStoreBaseList({
				claimId: getApp().globalData.userId
			}).then(({
				data
			}) => {
				if (Number(data.total)) {
					this.isRelate = true
					this.storeList = data.list || []
					this.detailList = this.storeList[0]
					this.pathFormat()
					this.getStats(this.detailList.id)
				} else {
					this.isRelate = false
				}
			})
		}
	}
</script>
<style lang='scss' scoped>
	.banner {
		width: 100%;
	}

	.detail_box {
		width: 702rpx;
		height: calc(100vh - 568rpx);
		margin-top: 24rpx;
		background-color: #FFF;
		overflow-y: auto;

		.box-current {
			display: flex;
			justify-content: space-between;
			padding: 28rpx;
			font-size: 28rpx;
			line-height: 44rpx;
			color: #333333;

			.my-select {
				display: flex;
				justify-content: space-between;
				align-items: center;
				width: 100%;
				font-family: PingFangSC, PingFangSC-Semibold;
				font-weight: 600;
				text-align: left;
				
				.store-name {
					flex: 1;
					display: flex;
					align-items: center;
					.qrcode {
						display: block;
						width: 32rpx;
						height: 32rpx;
						margin-left: 20rpx;
					}
				}
			}

			.text-left {
				font-weight: 400;
			}

			.text-right {
				width: 460rpx;
				font-weight: 400;
				text-align: right;
				color: #666666;
			}
		}
		
		.timeline-wrapper {
			padding: 28rpx;

			.u-order-title {
				color: #333333;
				font-weight: bold;
				font-size: 32rpx;
			}

			.u-order-desc {
				color: rgb(150, 150, 150);
				font-size: 28rpx;
				margin-bottom: 6rpx;
			}

			.u-order-time {
				color: rgb(200, 200, 200);
				font-size: 26rpx;
			}
		}
	}
	
	.statistics {
		display: flex;
		width: 100%;
		margin-top: 24rpx;
		padding: 12rpx 0;
		background: #ffffff;
		
		&-item {
			width: calc(100% / 3);
			line-height: 64rpx;
			text-align: center;
			
			&-num {
				font-weight: 500;
				font-size: 36rpx;
				
				&.one {
					color: #3786FD;
				}
				
				&.two {
					color: #FF8F33;
				}
				
				&.three {
					color: #FF5167;
				}
			}
			
			&-name {
				font-size: 28rpx;
			}
		}
	}

	.btn-list {
		width: 702rpx;
		margin: 20rpx 0;
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
			margin: 20rpx 80rpx;
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
</style>
