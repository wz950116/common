<template>
	<view>
		<view class="unload_box">
			<block v-for="(upload, index) in uploads" :key="index">
				<view class="img-list">
					<image v-if="upload.type ==='image'" :src="upload.src" class="unload_image"
						@tap="previewImage(index)"></image>
					<image v-if="upload.type ==='video'" :src="upload.src" class="unload_image"></image>
					<image v-if="upload.type ==='video'" :src="require('../../static/video_icon.png')"
						class="video_icon" @tap="previewImage(index)"></image>
					<image :src="require('../../static/clear_icon.png')" class="clear_icon" @click="moveImage(index)">
					</image>
				</view>
			</block>
			<view class="file_botton" v-if="uploads.length < count" @click="chooseMedia">
				<image :src="require('../../static/upload.png')" class="file_botton-img"></image>
				<p>{{ placeholder }}</p>
			</view>
		</view>
		<view v-if="videoFlag">
			<swiper class="video_box" :current="current" @change="swiperChange">
				<swiper-item v-for="(upload, index) in uploads" :key="index">
					<u-icon class="preview-close" name="close-circle-fill" color="#e2777a" size="64" @click="closeBox"></u-icon>
					<view v-if="upload.type==='video'">
						<video id="myVideo" :enable-play-gesture="true" :data-id="index" :src="upload.videoSrc" controls
							class="video_box" :show-fullscreen-btn="false" @play="playVideo"
							@pause="pauseVideo"></video>
					</view>
					<view v-if="upload.type==='image'">
						<image @click="closeBox" :src="upload.src" mode="widthFix" class="image_box"></image>
					</view>
				</swiper-item>
			</swiper>
		</view>
	</view>
</template>
<script>
	export default {
		props: {
			// 用于判断上传的是图片还是视频
			types: {
				type: Array,
				default: ['image', 'video']
			},
			// 上传的路径
			dataList: {
				type: Array,
				default: function() {
					return []
				}
			},
			// 图标 用于去除已经选中的文件
			// clearIon: {
			// 	type: String,
			// 	default: ''
			// },
			//  需要将文件上传到服务器的地址
			uploadUrl: {
				type: String,
				default: ''
			},
			//  删除文件的地址
			deleteUrl: {
				type: String,
				default: ''
			},
			//上传图片大小 默认3M
			upload_max: {
				type: Number,
				default: 3
			},
			// 上传视频时间最大长度 默认30秒
			maxDuration: {
				type: Number,
				default: 30
			},
			// 最多可以上传的总数
			count: {
				type: Number,
				default: 99
			},
			// 最多可以上传的图片数量
			imageCount: {
				type: Number,
				default: 99
			},
			// 最多可以上传的视频数量
			videoCount: {
				type: Number,
				default: 99
			},
			// 每次在图库可以选择的图片数量
			everyCount: {
				type: Number,
				default: 1
			},
			action: {
				type: String
			},
			placeholder: {
				type: String,
				default: '拍摄照片或小视频'
			}
		},
		data() {
			return {
				videoSrc: '',
				videoFlag: false,
				imageNum: 0,
				videoNum: 0,
				//展示的图片地址
				uploads: [],
				current: 0,
				beNum: null,
				nowNum: null
			}
		},
		mounted() {
			this.uploads = this.dataList
		},
		methods: {
			reset() {
				this.uploads = []
			},
			playVideo() {
				this.beNum = this.nowNum
			},
			pauseVideo() {
				this.beNum = null
			},
			swiperChange(e) {
				if (e.detail.current != this.beNum && this.beNum != null) {
					uni.createVideoContext('myVideo').pause()
				}
				this.nowNum = e.detail.current
			},
			closeBox() {
				this.videoFlag = false
			},
			previewImage(e) { // 预览图片
				this.current = e
				this.videoFlag = true
			},
			chooseMedia() {
				uni.chooseMedia({
					count: this.everyCount,
					mediaType: this.types,
					sourceType: ['album', 'camera'],
					sizeType: ['original', 'compressed'],
					maxDuration: this.maxDuration,
					camera: 'back',
					success: (res) => {
						uni.showLoading({
							title: '上传中'
						})
						if (res.errMsg === 'chooseMedia:ok') {
							res.tempFiles.forEach(item => {
								if (item.fileType === 'image') {
									if (this.imageNum === this.imageCount) {
										uni.showToast({
											title: '上传图片数量超过限制',
											icon: 'none'
										})
									} else {
										let uploadFile = getApp().globalData.fileUrl +
											'/file-service/api/file/upload'
										if (this.imageNum === 0) {
											uploadFile = getApp().globalData.fileUrl +
												'/file-service/api/file/upload?isAnalyze=false'
										}
										uni.uploadFile({
											url: this.uploadUrl || uploadFile,
											filePath: item.tempFilePath,
											fileType: 'image',
											name: 'file',
											header: {
												'accessToken': getApp().globalData.token
											},
											success: (img) => {
												if (img.statusCode === 200) {
													const res = JSON.parse(img.data)
													uni.showToast({
														title: '上传成功',
														icon: 'none'
													})
													if (this.imageNum === 0) {
														this.uploads.push({
															...res.data,
															type: 'image',
															src: res.data.fileUrl || res.data.url || (getApp().globalData.mqwbFileUrl + res.data.path),
															questionType: res.data.questionType
														})
													} else {
														this.uploads.push({
															...res.data,
															type: 'image',
															src: res.data.fileUrl || res.data.url || (getApp().globalData.mqwbFileUrl + res.data.path)
														})
													}
													this.$emit('onSuccess', this.uploads)
													this.imageNum++
												} else {
													uni.showToast({
														title: '上传失败',
														icon: 'error'
													})
												}
											}
										})
									}
								} else {
									if (this.videoNum === this.videoCount) {
										uni.showToast({
											title: '上传视频数量超过限制',
											icon: 'none'
										})
									} else {
										let uploadFile = getApp().globalData.fileUrl +
											'/file-service/api/file/upload'
										uni.uploadFile({
											url: this.uploadUrl || uploadFile,
											filePath: item.tempFilePath,
											fileType: 'video',
											name: 'file',
											header: {
												'accessToken': getApp().globalData.token
											},
											success: (video) => {
												if (video.statusCode === 200) {
													const res = JSON.parse(video.data)
													uni.showToast({
														title: '上传成功',
														icon: 'none'
													})
													let videoUrl = res.data.fileUrl || res.data.url || (getApp().globalData.mqwbFileUrl + res.data.path)
													this.uploads.push({
														...res.data,
														type: 'video',
														src: videoUrl,
														videoSrc: videoUrl
													})
													this.videoNum++
													this.$emit('onSuccess', this.uploads)
													
												} else {
													uni.showToast({
														title: '上传失败',
														icon: 'error'
													})
												}
											}
										})
									}
								}
							})
						}
					}
				})
			},
			moveImage(index) {
				uni.showModal({
					title: '提示',
					content: '您确定要移除此项吗？',
					success: (res) => {
						if (res.confirm) {
							//删除接口
							uni.showToast({
								title: '移除成功',
								icon: 'none'
							})
							if (this.uploads[index].type === 'image') {
								this.imageNum--
							} else {
								this.videoNum--
							}
							this.uploads.splice(index, 1)
							this.$emit('moveImage', index, this.uploads)
						} else if (res.cancel) {

						}
					}
				})
			},
			previewVideo(url) {
				this.videoFlag = true
				this.videoSrc = url
			}
		}
	}
</script>
<style lang='scss' scoped>
	.unload_box {
		display: flex;
		flex-direction: row;
		flex-wrap: wrap;

		.img-list {
			position: relative;
			margin-left: 16rpx;
		}
	}

	.file_botton {
		display: flex;
		flex-wrap: wrap;
		justify-content: center;
		align-items: center;
		margin-left: 16rpx;
		margin-bottom: 16rpx;
		height: 144rpx;
		width: 144rpx;
		border: 2rpx dashed #ddd;
		border-radius: 10rpx;
		text-align: center;

		p {
			width: 100%;
			height: 68rpx;
			opacity: 1;
			font-size: 24rpx;
			font-family: PingFangSC, PingFangSC-Regular;
			font-weight: 400;
			color: #999999;
		}
	}

	.unload_image {
		width: 144rpx;
		height: 144rpx;
	}

	.file_botton-img {
		height: 24rpx;
		width: 26rpx;
		margin-top: 40rpx;
	}

	.clear_icon {
		position: absolute;
		width: 26rpx;
		height: 26rpx;
		right: 0rpx;
	}

	.viode_clear_icon {
		position: absolute;
		right: 0rpx;
		top: 0rpx;
		width: 26rpx;
		height: 26rpx;
		z-index: 2;
	}

	.video_icon {
		position: absolute;
		right: 48rpx;
		top: 48rpx;
		width: 48rpx;
		height: 48rpx;
	}

	.video_box {
		position: fixed;
		right: 0;
		bottom: 0;
		top: 0;
		left: 0;
		width: 100vw;
		height: 100vh;
		background-color: #000000;
		z-index: 10;
	}

	.image_box {
		position: absolute;
		right: 0;
		bottom: 0;
		top: 0;
		left: 0;
		width: 100%;
		margin: auto;
		z-index: 12;
	}

	.preview-close {
		position: absolute;
		top: 30rpx;
		left: 30rpx;
		z-index: 99;
	}
</style>
