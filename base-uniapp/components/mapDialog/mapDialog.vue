<template>
	<u-popup v-model="showMap" mode="center">
		<view class="map-wrapper">
			<map class="map" :latitude="currentPoint.latitude" :longitude="currentPoint.longitude" :markers="covers" scale="15" id="isMap"
				ref="isMap" @tap="tap"></map>
			<view class="search-input">
				<u-icon name="search" color="#c8c9cc" size="45"></u-icon>
				<u-input v-model="searchVal" type="text" clearable placeholder="请输入地点进行搜索" @input="searchArea" />
			</view>
			<view class="search-tips" v-if="searchFlag">
				<view v-for="(item,index) in searchList" :key="index">
					<view class="search-tip" @click.prevent="handleArea(item)">
						{{ item.name }}({{ item.district }}{{ item.address }})
					</view>
				</view>
			</view>
			<view class="map-btn">
				<u-button @click="onMapClose">取消</u-button>
				<u-button type="primary" @click="onMapConfirm">确定</u-button>
			</view>
		</view>
	</u-popup>
</template>

<script>
	import amap from '../../common/js/amap-wx.130.js'
	export default {
		props: {
			// 维度
			latitude: [String, Number],
			// 经度
			longitude: [String, Number]
		},
		data() {
			return {
				map: null,
				amapPlugin: null,
				key: 'd0f7ed6de687f673858c73a3c44663fc',
				searchVal: '',
				searchList: [],
				searchFlag: false,
				covers: [],
				showMap: true,
				address: '',
				currentPoint: {
					latitude: '',
					longitude: ''
				}
			}
		},
		methods: {
			searchArea() {
				if (this.searchVal.trim() === '' || this.searchVal.length === 0) {
					this.searchList = []
					this.searchFlag = false
				} else {
					this.searchFlag = true
					this.amapPlugin.getInputtips({
						keywords: this.searchVal,
						location: '',
						success: (data) => {
							this.searchList = data.tips.filter(v => {
								return v.id && v.location?.length
							})
						},
						fail: (data) => {}
					})
				}
			},
			handleArea(item) {
				this.searchFlag = false
				this.searchVal = item.name
				this.searchList = []
				let arr = typeof item.location === 'string' ? item.location.split(',') : []
				this.currentPoint.longitude = arr[0] || 0
				this.currentPoint.latitude = arr[1] || 0
				this.getLocation()
			},
			tap(e) {
				this.currentPoint = e.detail
				this.getLocation()
			},
			getLocation() {
				this.covers = [{
					latitude: this.currentPoint.latitude,
					longitude: this.currentPoint.longitude,
					iconPath: '../../static/tbdddw@2x.png',
					id: -1,
					width: 28,
					height: 39
				}]
			},
			// 确认
			onMapConfirm() {
				// 高德地图自带查询
				// const that = this
				// try {
				// 	// 获取地理信息
				// 	this.amapPlugin.getRegeo({
				// 		location: that.currentPoint.longitude + ',' + that.currentPoint.latitude,
				// 		success(data) {
				// 			console.log(data)
				// 			if (data[0]) {
				// 				that.$emit('confirm', {
				// 					latitude: that.currentPoint.latitude,
				// 					longitude: that.currentPoint.longitude,
				// 					address: data[0].regeocodeData.formatted_address,
				// 					district: data[0].regeocodeData.district,
				// 					districtCode: data[0].regeocodeData.adcode,
				// 					street: data[0].regeocodeData.township,
				// 					streetCode: data[0].regeocodeData.towncode
				// 				})
				// 			}
				// 		},
				// 		fail() {}
				// 	})
				// } catch (e) {
				// 	console.log(e)
				// }
				
				// gis查询
				this.$u.api.queryDataByCoordinate({
					latitude: this.currentPoint.latitude,
					longitude: this.currentPoint.longitude
				}).then(({ data, code, msg }) => {
					if (code === 200) {
						this.$emit('confirm', {
							latitude: this.currentPoint.latitude,
							longitude: this.currentPoint.longitude,
							address: data.address,
							district: data.area,
							districtCode: data.areaCode,
							street: data.street,
							streetCode: data.streetCode,
							community: data.communityName,
							communityCode: data.communityCode
						})
					} else {
						this.$u.toast(msg || '点位有误')
					}
				})
			},
			onMapClose() {
				this.$emit('confirm', false)
			}
		},
		onReady() {
			this.map = uni.createMapContext('isMap')
		},
		mounted() {
			this.currentPoint.longitude = this.longitude
			this.currentPoint.latitude = this.latitude
			this.getLocation()
			// 初始化地图
			this.amapPlugin = new amap.AMapWX({
				key: this.key
			})
		}
	}
</script>

<style lang='scss' scoped>
	.map-wrapper {
		position: relative;
		width: 80vw;
		height: 80vh;

		.map {
			width: 100%;
			height: calc(100% - 120rpx);
		}

		.search-input {
			position: absolute;
			top: 32rpx;
			left: 32rpx;
			right: 32rpx;
			display: flex;
			padding: 0 20rpx;
			background-color: #fff;
			border-radius: 24rpx;
			z-index: 10;
			
			u-icon {
				width: 80rpx;
				text-align: center;
			}
			
			u-input {
				flex: 1;
			}
		}

		.search-tips {
			position: absolute;
			top: 112rpx;
			left: 32rpx;
			right: 32rpx;
			height: 600rpx;
			overflow-y: auto;
			background-color: #fff;
			font-size: 28rpx;
			color: #666666;
			z-index: 10;

			.search-tip {
				height: 88rpx;
				line-height: 88rpx;
				margin-left: 24rpx;
				overflow: hidden;
				text-overflow: ellipsis;
				white-space: nowrap;
				border-bottom: 1px solid #ddd;
			}
		}

		.map-btn {
			display: flex;
			justify-content: space-around;
			padding: 20rpx;
			
			u-button {
				width: 45%;
			}
		}
	}
</style>