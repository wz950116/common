<script>
	import amap from './common/js/amap-wx.130.js';
	import {
		baseUrl,
		fileUrl,
		mqwbFileUrl
	} from './common/config/config.js'
	export default {
		data() {
			return {
				amapPlugin: null,
				key: 'd0f7ed6de687f673858c73a3c44663fc',
			}
		},
		globalData: {
			nickName: '',
			avatarUrl: '',
			gender: '',
			lat: '',
			lon: '',
			httpUrl: baseUrl,
			fileUrl,
			mqwbFileUrl,
			token: '',
			mobile: '',
			address: '',
			userId: '',
			userName: ''
		},
		onLaunch: function() {
			this.amapPlugin = new amap.AMapWX({
				key: this.key
			});
			this.getLocation();
			this.changeLogin();
		},
		onShow: function() {},
		onHide: function() {},
		methods: {
			//获取地理信息
			getRegeo(longitude, latitude) {
				try {
					this.amapPlugin.getRegeo({
						location: '' + longitude + ',' + latitude + '',
						success: (data) => {
							if (data[0]) {
								getApp().globalData.address = data[0].regeocodeData.formatted_address
								uni.$emit('update', {
									msg: '获取地址'
								})
							}
						},
						fail: (data) => {}
					})
				} catch (e) {
					console.log(e)
				}
			},
			changeLogin() {
				uni.login({
					provider: 'weixin',
					success: function(loginRes) {
						// 获取用户信息
						// 授权
						uni.request({
							url: getApp().globalData.httpUrl + '/ps/common/security/logon-applet',
							data: {
								code: loginRes.code,
								nickName: getApp().globalData.nickName
							},
							header: {
								'content-type': 'application/json'
							},
							method: 'POST',
							success: (res) => {
								console.log(res, 'init')
								getApp().globalData.token = res.data.data.accessToken
								getApp().globalData.userId = res.data.data.userId
								getApp().globalData.userName = res.data.data.userName
								try {
									const value = uni.getStorageSync('storage_key');
									if (value) {
										getApp().globalData.nickName = value.nickName
										getApp().globalData.avatarUrl = value.avatarUrl
										getApp().globalData.gender = value.gender
									}
									const data = uni.getStorageSync('mobile');
									if (data) {
										getApp().globalData.mobile = data
									}
								} catch (e) {}
							}
						});
					}
				});
			},
			getLocation() {
				uni.getLocation({
					type: 'gcj02',
					geocode: true, //设置该参数为true可直接获取经纬度及城市信息
					success: (res) => {
						getApp().globalData.lat = res.latitude
						getApp().globalData.lon = res.longitude
						this.getRegeo(res.longitude, res.latitude)
					},
					fail: function() {
						uni.showToast({
							title: '获取地址失败，将导致部分功能不可用',
							icon: 'none'
						});
					}
				});
			}
		},

	}
</script>

<style lang="scss">
	/* 注意要写在第一行，同时给style标签加入lang="scss"属性 */

	@import "uview-ui/index.scss";
	@import './common/css/common.scss';

	html {
		background-color: #F7FAFB !important
	}
</style>
