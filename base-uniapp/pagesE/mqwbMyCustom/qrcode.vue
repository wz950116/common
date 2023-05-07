<template>
	<view class="uni_content">
		<view class="detail-info">
			<view class="qrcode">
				<canvas v-show="!showBlue" canvas-id="firstCanvas" id="firstCanvas" class="firstCanvas" />
			</view>
			<view class="info">{{ storeName }}</view>
			<view class="sub-info">二维码用于执法人员扫描核对商户情况，请打印后，张贴至门口处</view>
			<view class="btn-list">
				<u-button @click="onBlue">在线打印</u-button>
				<u-button type="primary" @click="onDownload">下载图片</u-button>
			</view>
		</view>
		<u-popup v-model="showBlue" mode="center">
			<view class="blue-wrapper">
				<view class="blue-title">附近设备</view>
				<view class="device-loading"><u-loading mode="circle"></u-loading></view>
				<scroll-view scroll-y="true" class="blue-list">
					<view v-if="devices.length">
						<u-radio-group v-model="blueVal">
							<u-radio v-for="item in devices" :key="item.deviceId" :name="item.name">
								{{item.name}}
							</u-radio>
						</u-radio-group>
					</view>
					<view v-else class="empty">暂无设备</view>
				</scroll-view>
				<view class="blue-btn">
					<u-button @click="showBlue = false">取消</u-button>
					<u-button type="primary" @click="onConn">连接</u-button>
				</view>
			</view>
		</u-popup>
		<u-toast ref="uToast" />
		<u-modal v-model="isPrintConfirm" content="连接成功，是否打印？" show-cancel-button @confirm="onPrint"></u-modal>
	</view>
</template>
<script>
	import tsc from '@/common/js/libs/tsc.js'
	import esc from '@/common/js/libs/esc.js'
	export default {
		data() {
			return {
				storeId: '',
				storeName: '',
				qrCode: '',
				devices: [],
				currDev: null,
				canvasWidth: 200,
				canvasHeight: 200,
				msg: '',
				showBlue: false,
				blueVal: '',
				isPrintConfirm: false
			}
		},
		methods: {
			// 初始化蓝牙搜索
			onBlue() {
				// 先断开上次的连接
				if (this.currDev) {
					uni.closeBLEConnection({
						deviceId: this.currDev.deviceId,
						success: (res) => {
							console.log('断开成功！', res)
							this.currDev = null
							this.openBlue()
						}
					})
				} else {
					this.openBlue()
				}
			},
			openBlue() {
				uni.openBluetoothAdapter({
					success: (res) => {
						this.showBlue = true
						// 监听新设备
						this.onDevice()
						// 监听本机蓝牙适配器状态变化事件
						this.onStatus()
					},
					fail: () => {
						this.$u.toast('请打开蓝牙搜索功能')
					}
				})
			},
			onDevice() {
				console.log("监听寻找到新设备的事件---------------")
				// 监听寻找到新设备的事件
				uni.onBluetoothDeviceFound((devices) => {
					const re = JSON.parse(JSON.stringify(devices))
					console.log(re.devices[0].deviceId, re.devices[0], 'new Device')
					let name = re.devices[0].name
					if (name !== "未知设备" && name) {
						let deviceId = re.devices[0].deviceId
						if (this.devices.find(v => v.deviceId === deviceId)) return
						this.devices.push({
							name,
							deviceId,
							services: []
						})
					}
				})
			},
			onStatus() {
				uni.getBluetoothAdapterState({
					success: (res) => {
						if (res.available) {
							if (res.discovering) {
								this.stopFindBule()
							}
							// 搜索蓝牙
							// 开始搜寻附近的蓝牙外围设备
							console.log("开始搜寻附近的蓝牙外围设备")
							uni.startBluetoothDevicesDiscovery({})

						} else {
							this.$u.toast('本机蓝牙不可用')
						}
					}
				})
			},
			stopFindBule() {
				console.log("停止搜寻附近的蓝牙外围设备")
				uni.stopBluetoothDevicesDiscovery({})
			},
			onConn() {
				const item = this.devices.find(v => v.name === this.blueVal)
				console.log("连接蓝牙ID: " + item.deviceId)
				let deviceId = item.deviceId
				uni.showLoading({
					title: '正在连接...'
				})
				uni.createBLEConnection({
					deviceId,
					complete: (res) => {
						console.log(res, '连接结果...')
						if (res.errMsg === "createBLEConnection:ok") {
							// 连接成功 关闭搜索
							this.stopFindBule()
							this.currDev = item
							setTimeout(() => {
								// 获取蓝牙设备所有服务(service)
								this.getBLEServices(deviceId)
							}, 2000)
						} else {
							this.$u.toast('连接蓝牙失败')
						}
					}
				})
			},
			getBLEServices(deviceId) {
				const that = this
				console.log("获取蓝牙设备所有服务(service)。")
				uni.getBLEDeviceServices({
					// 这里的 deviceId 需要已经通过 createBLEConnection 与对应设备建立链接
					deviceId,
					complete(res) {
						console.log(res, 999)
						let serviceId = ""
						if (res.services) {
							for (var s = 0; s < res.services.length; s++) {
								console.log(res.services[s].uuid)
								let serviceId = res.services[s].uuid
								uni.getBLEDeviceCharacteristics({
									// 这里的 deviceId 需要已经通过 createBLEConnection 与对应设备建立链接
									deviceId,
									// 这里的 serviceId 需要在 getBLEDeviceServices 接口中获取
									serviceId,
									success(res) {
										var re = JSON.parse(JSON.stringify(res))
										for (var c = 0; c < re.characteristics.length; c++) {
											if (re.characteristics[c].properties.write == true) {
												let uuid = re.characteristics[c].uuid
												for (var index in that.devices) {
													if (that.devices[index]?.deviceId === deviceId) {
														that.devices[index].services.push({
															serviceId,
															characteristicId: uuid
														})
														break
													}
												}
											}
										}
										// 连接蓝牙服务成功，去打印
										if (that.currDev.services[0]) {
											uni.hideLoading()
											that.isPrintConfirm = true
										} else {
											that.$u.toast('暂无服务')
										}
									}
								})
							}
						} else {
							that.$u.toast('暂无服务')
						}
					},
					fail(res) {
						that.$u.toast('获取失败')
					}
				})
			},
			senBlData(deviceId, serviceId, characteristicId, uint8Array) {
				var uint8Buf = Array.from(uint8Array);
				console.log(uint8Buf, 'uint8Buf')

				function split_array(datas, size) {
					var result = {};
					var j = 0
					if (datas.length < size) {
						size = datas.length
					}
					for (var i = 0; i < datas.length; i += size) {
						result[j] = datas.slice(i, i + size)
						j++
					}
					return result
				}
				var sendloop = split_array(uint8Buf, 20);
				console.log(sendloop, 'sendloop')

				function realWriteData(sendloop, i) {
					var data = sendloop[i]
					if (typeof(data) == "undefined") {
						return
					}
					var buffer = new ArrayBuffer(data.length)
					var dataView = new DataView(buffer)
					for (var j = 0; j < data.length; j++) {
						dataView.setUint8(j, data[j]);
					}
					console.log(buffer, 'buffer')
					uni.writeBLECharacteristicValue({
						deviceId,
						serviceId,
						characteristicId,
						value: buffer,
						success(res) {
							console.log('发送成功', i)
							setTimeout(() => {
								realWriteData(sendloop, i + 1);
							}, 100)
						},
						fail(e) {
							console.log('发送数据失败')
							console.log(e)
						}
					})
				}
				var i = 0;
				realWriteData(sendloop, i);
			},
			onPrint() {
				console.log(this.currDev, 9999)
				//标签模式
				let deviceId = this.currDev.deviceId
				let serviceId = this.currDev.services[0]?.serviceId
				let characteristicId = this.currDev.services[0]?.characteristicId

				uni.canvasGetImageData({
					canvasId: 'firstCanvas',
					x: 0,
					y: 0,
					width: this.canvasWidth,
					height: this.canvasHeight,
					success: (res) => {
						console.log(res, res.width, res.data, 'canvasData')
						const qrContent = JSON.stringify({ id: Number(this.storeId), type: 'MQWB_STORE_EDIT' })
						var command = tsc.jpPrinter.createNew()
						command.init(0, 200, 200, 300, 1)
						command.setSize(200, 200)
						command.setGap(2)
						command.setCls()
						command.setQR(30, 50, 2, 6, qrContent)
						// command.setMag(2, 2)
						// command.setText1(55, 30, 180, 60, "商户名称：" + this.storeName)
						// command.setMag(2, 2)
						// 直接打印画布（暂未实现）
						// command.setBitmap(100, 0, 0, res)
						// command.setBitmap2(100, 100, 0, res)
						// command.setBox(5, 5, 795, 595, 1)
						command.setPagePrint()
						console.log(deviceId, serviceId, characteristicId, command.getData(), 'print')
						// 转码处理并向低功耗蓝牙设备写入二进制数据
						this.senBlData(deviceId, serviceId, characteristicId, command.getData())
						this.$refs.uToast.show({
							title: '发送成功，正在打印...',
							callback: () => {
								this.showBlue = false
							}
						})
					},
					fail: (res) => {
						console.log(res)
					}
				})
			},
			onDownload() {
				const filePath = this.qrCode
				uni.showLoading({
					title: '下载中'
				})
				uni.downloadFile({
					url: filePath,
					success: (res) => {
						const filePath = res.tempFilePath
						// 保存到相册，不支持网络链接所以需要downloadFile转换
						uni.saveImageToPhotosAlbum({
							filePath,
							success() {
								uni.showToast({
									title: '保存成功',
									icon: 'success',
									duration: 1000
								})
							}
						})
					}
				})
			}
		},
		onLoad(option) {
			this.storeId = option.id
			this.storeName = option.name
			this.qrCode = getApp().globalData.mqwbFileUrl + option.qrCode
			// 画布
			const firstCanvas = uni.createCanvasContext('firstCanvas', this)
			uni.getImageInfo({
				src: this.qrCode,
				success: (res) => {
					firstCanvas.drawImage(res.path, 0, 0, this.canvasWidth, this.canvasHeight)
					firstCanvas.draw()
				}
			})
		}
	}
</script>
<style lang='scss' scoped>
	.detail-info {
		width: 100%;
		text-align: center;
		margin-top: 100rpx;

		.qrcode {
			width: 460rpx;
			height: 460rpx;
			margin: 0 auto 28rpx;

			#firstCanvas {
				display: block;
				width: 460rpx;
				height: 460rpx;
			}
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

	.blue-wrapper {
		position: relative;
		width: 80vw;
		height: 80vh;
		text-align: center;

		.blue-title {
			width: 100%;
			height: 120rpx;
			line-height: 120rpx;
			font-size: 36rpx;
			font-weight: 500;
			border-bottom: 2rpx solid #e4e7ed;
		}
		
		.device-loading {
			margin-top: 10rpx;
		}

		.blue-list {
			width: 100%;
			height: calc(100% - 290rpx);

			u-radio-group {
				u-radio {
					display: block;
					height: 60rpx;
					margin: 40rpx;
				}
			}
		}

		.empty {
			font-size: 36rpx;
			line-height: 100rpx;
		}

		.blue-btn {
			display: flex;
			justify-content: space-around;
			padding: 20rpx;

			u-button {
				width: 45%;
			}
		}
	}
</style>
