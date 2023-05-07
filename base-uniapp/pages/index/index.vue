<template>
	<view>
		<view class="uni_content" v-if="current===0">
			<view class="uni_warp">
				<u-swiper :list="listSwiper"></u-swiper>
			</view>
			<view class="uni_warp my_bg" @click="clickMyTip">
				<image :src="require('../../static/bl_index.png')"></image>
				<span>我要爆料</span>
			</view>
			<view class="uni_box uni_shadow-border">
				<view class="uni_box_title">
					门前五包
				</view>
				<u-grid :col="4" :border="false">
					<u-grid-item @click="clickStoreRL">
						<image :src="require('../../static/cgdt_index.png')" class="uni_badge-icon"></image>
						<view class="uni_grid-text">商户认领</view>
					</u-grid-item>
					<u-grid-item @click="clickStoreDJ">
						<image :src="require('../../static/zcfg_index.png')" class="uni_badge-icon"></image>
						<view class="uni_grid-text">商户登记</view>
					</u-grid-item>
					<u-grid-item @click="clickEventIssue">
						<image :src="require('../../static/mryt_index.png')" class="uni_badge-icon"></image>
						<view class="uni_grid-text">案件反馈</view>
					</u-grid-item>
					<u-grid-item @click="clickMyCustom">
						<image :src="require('../../static/yxaj_index.png')" class="uni_badge-icon"></image>
						<view class="uni_grid-text">我的商户</view>
					</u-grid-item>
				</u-grid>
			</view>
		</view>
		<view v-if="current === 1">
			<view class="uni_content">
				<view class="user_bg">
					<image :src="userImage"></image>
					<span>{{userName}}</span>
					<button v-if="!isLogin" @tap="getUserInfo" lang="zh_CN">登录</button>
					<button v-if="isTokenLogin" @tap="getTokenLogin">登录</button>
				</view>
				<view class="user_center uni_shadow-border">
					<u-row>
						<u-col span="2">
							<view class="uni_row-text">
								积分
							</view>
						</u-col>
						<u-col span="3">
							<view class="uni_row-num">
								{{personCount}}
							</view>
						</u-col>
						<u-col span="1">
							<u-line margin="30rpx 36rpx" color="#ccc" direction="col" length="44rpx" />
						</u-col>
						<u-col span="3">
							<view class="uni_row-text">
								上报问题
							</view>
						</u-col>
						<u-col span="3">
							<view class="uni_row-num cneter">
								{{totalCount}}
							</view>
						</u-col>
					</u-row>
				</view>
			</view>
		</view>
		<view class="">
			<u-popup mode="center" v-model="showFlag">
				<view class="content-popup">
					<view class="popup_top">
						<image :src="require('../../static/wdjf_index.png')"></image>
						<view class="text">
							<view class="text_top">
								感谢您的支持
							</view>
							<view class="text_bottom">
								积分奖励 +10
							</view>
						</view>
					</view>
					<view class="popup-center">
						您的爆料已被成功处理
					</view>
					<view class="popup-bottom">
						详情请在 历史爆料 查看
					</view>
					<u-line color="#EBEDF0"></u-line>
					<view class="confrim-btn">
						<button plain @click="showFlag = false;">确定</button>
					</view>
				</view>
			</u-popup>
		</view>
		<u-tabbar v-model="current" :list="listBottom" active-color="#0482FF" inactive-color="#999999"
			@change="changeBottom"></u-tabbar>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				isTokenLogin: false,
				isLogin: false,
				showFlag: false,
				listSwiper: [{
						image: 'http://10.12.102.197:9333/32,06ac14234595'
					},
					{
						image: 'http://10.12.102.197:9333/34,06ae0b110bc6'
					}
				],
				listBottom: [{
						iconPath: "home",
						selectedIconPath: "home-fill",
						text: '首页',
						isDot: false,
						customIcon: false,
					},
					{
						iconPath: "account",
						selectedIconPath: "account-fill",
						text: '个人中心',
						isDot: false,
						customIcon: false,
					},
				],
				current: 0,
				userName: '',
				userImage: '',
				totalCount: 0,
				personCount: 0,
			}
		},
		onShow() {
			this.init();
		},
		onLoad(option) {
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
			this.userName = getApp().globalData.nickName || '请登录'
			this.userImage = getApp().globalData.avatarUrl || '../../static/tx.png'
			if (option.tabId) {
				this.userName = '请登录'
				this.userImage = '../../static/tx.png'
				this.current = 1
				this.isTokenLogin = true
				this.isLogin = true
				this.personCount = 0
				this.totalCount = 0
			}
		},
		methods: {
			init() {
				uni.$on('getPersonCredit', (data) => {
					this.getPersonCredit()
				})
			},
			getPersonCredit() {
				this.$u.api.personCredit().then(res => {
					this.personCount = res.data.creditAmount
				})
			},
			getDiscloseNum() {
				this.$u.api.hisDiscloses({
					start: 1,
					limit: 5
				}).then(res => {
					this.totalCount = res.totalCount
				})
			},
			getUserInfo() {
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
								getApp().globalData.token = res.data.data.accessToken
							}
						});
					},
				})
				uni.getUserProfile({
					desc: '用于完善个人信息', // 声明获取用户个人信息后的用途，后续会展示在弹窗中，请谨慎填写
					success: (res) => {
						getApp().globalData.nickName = res.userInfo.nickName
						getApp().globalData.avatarUrl = res.userInfo.avatarUrl
						if (res.userInfo.gender === 0) {
							getApp().globalData.gender = '未知'
						} else if (res.userInfo.gender === 1) {
							getApp().globalData.gender = '男性'
						} else {
							getApp().globalData.gender = '女性'
						}
						uni.setStorage({
							key: 'storage_key',
							data: {
								nickName: res.userInfo.nickName,
								avatarUrl: res.userInfo.avatarUrl,
								gender: getApp().globalData.gender
							},
							success: function() {}
						});
						uni.redirectTo({
							url: '../index/index'
						})
					}
				})
			},
			getTokenLogin() {
				this.isTokenLogin = false
				uni.login({
					provider: 'weixin',
					success: (loginRes) => {
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
								getApp().globalData.token = res.data.data.accessToken
								uni.showToast({
									title: '登录成功',
									icon: 'none'
								})
								this.userName = getApp().globalData.nickName
								this.userImage = getApp().globalData.avatarUrl
							}
						});
					}
				});
			},
			changeBottom(index) {
				if (index === 1) {
					if (getApp().globalData.nickName == '') {
						this.isLogin = false
					} else {
						this.isLogin = true
						this.getPersonCredit()
						this.getDiscloseNum()
					}
				}
			},
			clickMyTip() {
				uni.navigateTo({
					url: '../breakNews/index'
				})
			},
			clickStoreRL() {
				uni.navigateTo({
					url: '../../pagesE/mqwbStoreRL/index'
				})
			},
			clickStoreDJ() {
				uni.navigateTo({
					url: '../../pagesE/mqwbStoreDJ/index'
				})
			},
			clickEventIssue() {
				uni.navigateTo({
					url: '../../pagesE/mqwbEventIssue/index'
				})
			},
			clickMyCustom() {
				uni.navigateTo({
					url: '../../pagesE/mqwbMyCustom/index'
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	.my_bg {
		background-image: url(../../static/bg_index.png);
		background-size: 726rpx 168rpx;
		background-repeat: no-repeat;
		background-position: center;
		margin-top: 12rpx;
		height: 168rpx;
		display: flex;
		margin-bottom: 8rpx;

		image {
			width: 48rpx;
			height: 48rpx;
			margin-top: 36rpx;
			margin-left: 236rpx;
		}

		span {
			margin-top: 28rpx;
			line-height: 56rpx;
			height: 40rpx;
			margin-left: 24rpx;
			color: #F7FAFB;
			font-size: 40rpx;
			font-family: PingFangSC;
			font-weight: 600;
		}
	}

	.user_bg {
		background-color: #0482FF;
		width: 100%;
		height: 268rpx;
		display: flex;

		image {
			width: 128rpx;
			height: 128rpx;
			opacity: 1;
			border-radius: 50%;
			margin-top: 40rpx;
			margin-left: 24rpx;
		}

		span {
			margin-top: 66rpx;
			width: 80px;
			height: 38px;
			opacity: 1;
			font-size: 20px;
			font-family: PingFangSC, PingFangSC-Medium;
			font-weight: 600;
			text-align: left;
			color: #ffffff;
			line-height: 38px;
			margin-left: 32rpx;
		}

		button {
			margin-top: 70rpx;
			margin-left: 240rpx;
			background-color: #FFF;
			font-size: 24rpx;
			color: #0482ff;
			width: 112rpx;
			height: 64rpx;
		}
	}

	.user_center {
		height: 104rpx;
		width: 704rpx;
		background-color: #fff;
		position: absolute;
		top: 216rpx;
	}

	.cneter {
		text-align: center;
	}

	.content-popup {
		width: 622rpx;
		height: 496rpx;

		.popup_top {
			display: flex;
			width: 100%;
			height: 204rpx;

			image {
				height: 112rpx;
				width: 112rpx;
				margin: 60rpx 28rpx 0rpx 124rpx;
			}

			.text {
				margin-top: 60rpx;
				height: 44rpx;
				font-size: 14px;
				font-weight: 400;
				text-align: left;
				color: #666666;
				line-height: 44rpx;

				.text_bottom {
					color: #333333;
					margin-top: 18rpx;
				}
			}
		}
	}

	.popup-center {
		margin: 40rpx 48rpx 24rpx 48rpx;
		width: 526rpx;
		font-size: 32rpx;
		font-weight: 600;
		text-align: center;
		color: #333333;
		line-height: 48rpx;
	}

	.popup-bottom {
		margin-left: 48rpx;
		margin-bottom: 42rpx;
		width: 526rpx;
		height: 44rpx;
		font-size: 28rpx;
		font-weight: 400;
		text-align: center;
		color: #666666;
		line-height: 44rpx;
	}

	.confrim-btn {
		height: 96rpx;

		button {
			color: #0482FF;
			font-size: 32rpx;
			border: none;
		}
	}
</style>
