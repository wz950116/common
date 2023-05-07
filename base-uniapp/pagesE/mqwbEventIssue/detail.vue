<template>
	<view class="uni_content">
		<u-swiper class="banner" :list="detailList.files" name="url" img-mode="aspectFit" @click="onPreview"></u-swiper>
		<view class="detail_box uni_shadow-border">
			<view class="box-current">
				<view class="title">
					{{detailList.storeName}}
				</view>
				<view class="text-right">
					<text class="manage-type">{{detailList.manageTypeName}}</text>
				</view>
			</view>
			<u-line color="#EBEBEB"></u-line>
			<view class="box-current">
				<view class="text-left">
					问题描述
				</view>
				<view class="text-right">
					{{detailList.caseDesc}}
				</view>
			</view>
			<u-line color="#EBEBEB"></u-line>
			<view class="box-current">
				<view class="text-left">
					上报时间
				</view>
				<view class="text-right">
					{{detailList.createTime}}
				</view>
			</view>
			<u-line color="#EBEBEB"></u-line>
			<view class="box-current">
				<view class="text-left">
					问题类型
				</view>
				<view class="text-right">
					{{detailList.typeName}}/{{detailList.subTypeName}}/{{detailList.codeName}}
				</view>
			</view>
			<u-line color="#EBEBEB"></u-line>
			<view class="box-current">
				<view class="text-left">
					立案条件
				</view>
				<view class="text-right">
					{{detailList.acceptStandard}}
				</view>
			</view>
			<u-line color="#EBEBEB"></u-line>
			<view class="box-current">
				<view class="text-left">
					结案条件
				</view>
				<view class="text-right">
					{{detailList.closeStandard}}
				</view>
			</view>
			<u-line color="#EBEBEB"></u-line>
			<view class="box-current">
				<view class="area-title">
					详细地址
				</view>
				<view class="text-right">
					{{detailList.address}}
				</view>
			</view>
			<view class="timeline-wrapper">
				<u-time-line>
					<u-time-line-item v-for="item in logList" :key="item.id">
						<template v-slot:content>
							<view>
								<view class="u-order-title">{{ item.opTypeDesc }}</view>
								<view class="u-order-desc">{{ item.content }}</view>
								<view class="u-order-time">{{ item.createTime }}</view>
							</view>
						</template>
					</u-time-line-item>
				</u-time-line>
			</view>
		</view>
		<!-- 预览 -->
		<view class="preview-box" v-if="showPreview">
			<u-icon class="preview-close" name="close-circle-fill" color="#e2777a" size="64" @click="closeBox"></u-icon>
			<video v-if="detailList.files[current].type==='video'" class="preview-video"
				:src="detailList.files[current].path" controls :enable-play-gesture="true"
				:show-fullscreen-btn="false"></video>
			<image v-if="detailList.files[current].type==='image'" class="preview-image"
				:src="detailList.files[current].path" mode="widthFix" @click="closeBox">
			</image>
		</view>
		<view v-if="detailList.handleType === 1 && detailList.isHandle === 0" class="btn-list">
			<u-button type="primary" @click="handleSubmit">处理</u-button>
		</view>
	</view>
</template>
<script>
	export default {
		data() {
			return {
				current: 0,
				videoSrc: '',
				showPreview: false,
				detailList: {
					files: []
				},
				logList: []
			}
		},
		methods: {
			init(id) {
				this.$u.api.findStoreCaseById({
					storeCaseId: id
				}).then(({
					data,
					success
				}) => {
					if (success) {
						this.detailList = data
						// 合并展示图片视频
						if (this.detailList.videoFiles && this.detailList.videoFiles.length) {
							this.detailList.files = this.detailList.files.concat(this.detailList.videoFiles).sort((
								a, b) => a.id - b.id)
						}
						this.detailList.files.forEach(item => {
							if (item.path.includes('.mp4')) {
								item.url = require('@/static/video_icon_large.png')
								item.path = getApp().globalData.mqwbFileUrl + item.path
								item.type = 'video'
							} else {
								item.url = getApp().globalData.mqwbFileUrl + item.path
								item.path = getApp().globalData.mqwbFileUrl + item.path
								item.type = 'image'
							}
						})
						this.$u.api.findStoreCaseOpLogByListByPage({
							caseNo: this.detailList.caseNo,
							pageNum: 1,
							pageSize: 999
						}).then(({
							data,
							success
						}) => {
							if (success) {
								this.logList = data.list || []
							}
						})
					}
				})
			},
			handleSubmit() {
				const {
					caseNo
				} = this.detailList
				uni.navigateTo({
					url: `./confirm?caseNo=${caseNo}`
				})
			},
			closeBox() {
				this.showPreview = false
			},
			// 预览
			onPreview(index) {
				this.current = index
				this.showPreview = true
			}
		},
		onLoad(option) {
			this.init(option.id)
		}
	}
</script>
<style lang='scss' scoped>
	.banner {
		width: 100%;
	}

	.detail_box {
		width: 702rpx;
		height: calc(100vh - 392rpx);
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

			.title {
				font-family: PingFangSC, PingFangSC-Semibold;
				font-weight: 600;
				text-align: left;
			}

			.text-left {
				font-weight: 400;
			}

			.text-right {
				width: 460rpx;
				font-weight: 400;
				text-align: right;
				color: #666666;

				.manage-type {
					background: #0482ff29;
					border-radius: 4px;
					padding: 10rpx 20rpx;
					color: #333333;
				}
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

	.btn-list {
		width: 702rpx;
		margin: 20rpx 0;
	}

	.preview-box {
		position: fixed;
		right: 0;
		bottom: 0;
		top: 0;
		left: 0;
		width: 100vw;
		height: 100vh;
		background-color: #000000;
		z-index: 99;
	}

	.preview-video {
		position: absolute;
		width: 100vw;
		height: 100vh;
	}

	.preview-image {
		position: absolute;
		right: 0;
		bottom: 0;
		top: 0;
		left: 0;
		width: 100vw;
		max-height: 80vh;
		margin: auto;
	}

	.preview-close {
		position: absolute;
		top: 30rpx;
		left: 30rpx;
		z-index: 9;
	}
</style>
