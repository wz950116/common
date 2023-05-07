<template>
	<view class="uni_content">
		<view class="detail_box uni_shadow-border">
			<view class="box-current">
				<view class="text-left">
					商户名称
				</view>
				<view class="text-right">
					{{detailList.storeName}}
				</view>
			</view>
			<u-line color="#EBEBEB"></u-line>
			<view class="box-current">
				<view class="text-left">
					认领状态
				</view>
				<view class="text-right" :style="{ color: detailList.isClaimDesc === '已认领' ? '#01C1A3' : '#0482FF' }">
					{{detailList.isClaimDesc}}
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
			<view class="form-list">
				<u-form :model="form" ref="uForm">
					<u-form-item label="联系电话" prop="phone" label-width="120" required>
						<u-input v-model="form.phone" />
					</u-form-item>
					<u-form-item label="验证码" prop="intro" label-width="120" required>
						<view class="form-yzm">
							<u-input class="value" v-model="form.intro" type="number" placeholder="输入验证码" />
							<u-verification-code :seconds="60" ref="uCode" @change="codeChange">
							</u-verification-code>
							<button class="btn-code" @tap="clickSend">{{tips}}</button>
						</view>
					</u-form-item>
				</u-form>
			</view>
		</view>
		<view class="btn-list">
			<u-button v-if="mobile" type="primary" :disabled="submitFlag" @click="handleSubmit">确定
			</u-button>
			<u-button v-else type="primary" :disabled="submitFlag" open-type="getPhoneNumber" @getphonenumber="handleSubmit">确定
			</u-button>
		</view>
		<u-toast ref="uToast" />
	</view>
</template>
<script>
	export default {
		data() {
			return {
				detailList: {},
				submitFlag: false,
				tips: '获取验证码',
				mobile: '',
				form: {
					phone: '',
					intro: ''
				},
				rules: {
					phone: [{
						required: true,
						message: '请输入手机号',
						trigger: ['blur']
					}, {
						// validator: (rule, value, callback) => {
						// 	// 返回true表示校验通过，返回false表示不通过
						// 	return this.$u.test.mobile(value)
						// },
						// message: '手机号格式不正确',
						// trigger: ['blur']
					}],
					intro: [{
						required: true,
						message: '请输入验证码',
						trigger: ['blur']
					}]
				}
			}
		},
		methods: {
			init(id) {
				this.$u.api.findStoreBaseByIdv2({
					storeBaseId: id
				}).then(res => {
					this.detailList = res.data
					// 初始化对已认领商户进行提示
					if (this.detailList.isClaimDesc === '已认领') {
						this.$refs.uToast.show({
							title: '当前商户已被其他用户认领，若错误认领，请尽快输入店主手机号进行重新认领。',
							type: 'warning',
							duration: 5000
						})
					}
				})
			},
			codeChange(text) {
				this.tips = text
			},
			async clickSend() {
				if (!this.form.phone) {
					this.$u.toast('请填写手机号')
					return false
				}
				// if (!this.$u.test.mobile(this.form.phone)) {
				// 	this.$u.toast('手机号格式不正确')
				// 	return false
				// }
				const res = await this.$u.api.checkStoreBaseByTel({
					id: this.detailList.id,
					claimTel: this.form.phone
				})
				if (res.data) {
					if (this.$refs.uCode.canGetCode) {
						uni.showLoading({
							title: '正在获取验证码'
						})
						// 模拟向后端请求验证码
						setTimeout(() => {
							uni.hideLoading()
							// 这里此提示会被this.start()方法中的提示覆盖
							this.$u.toast('验证码已发送')
							// 通知验证码组件内部开始倒计时
							this.$refs.uCode.start()
						}, 2000)
					} else {
						this.$u.toast('倒计时结束后再发送')
					}
				} else {
					this.$refs.uToast.show({
						title: '您输入联系电话和备案电话不一致无法发送验证码，请联系社区网格人员',
						type: 'warning',
						duration: 5000
					})
				}
			},
			async handleSubmit(e) {
				console.log(this.mobile, e, 0)
				if (!this.mobile) {
					if (!e.detail.code) return
					const res = await this.$u.api.getUserPhoneNumber({
						code: e.detail.code
					})
					if (res.success) {
						this.mobile = res.data.phone_info.phoneNumber
						getApp().globalData.mobile = this.mobile
						uni.setStorageSync('mobile', this.mobile)
					}
				}
				this.$refs.uForm.validate(async valid => {
					if (valid) {
						// 再次验证手机号，防止发送验证码后再次修改
						const res = await this.$u.api.checkStoreBaseByTel({
							id: this.detailList.id,
							claimTel: this.form.phone
						})
						if (!res.data) {
							this.$refs.uToast.show({
								title: '您输入联系电话和备案电话不一致无法发送验证码，请联系社区网格人员',
								type: 'warning',
								duration: 5000
							})
							return false
						}
						this.submitFlag = true
						uni.showLoading({
							title: '提交中'
						})
						this.$u.api.claimStoreBaseById({
							claimAccount: getApp().globalData.userName,
							claimId: getApp().globalData.userId,
							claimTel: this.mobile,
							id: this.detailList.id
						}).then(res => {
							if (res.success) {
								this.$refs.uToast.show({
									title: '认领成功',
									type: 'success',
									back: true
								})
							} else {
								this.$refs.uToast.show({
									title: res.message || '认领失败',
									type: 'error'
								})
								this.submitFlag = false
							}
						}).catch(() => {
							uni.hideLoading()
							this.submitFlag = false
						})
					} else {
						console.log('验证失败')
					}
				})
			}
		},
		onLoad(option) {
			this.mobile = getApp().globalData.mobile
			this.init(option.id)
		},
		// 必须要在onReady生命周期，因为onLoad生命周期组件可能尚未创建完毕
		onReady() {
			this.$refs.uForm.setRules(this.rules)
		}
	}
</script>
<style lang='scss' scoped>
	.detail_box {
		width: 702rpx;
		height: calc(100vh - 142rpx);
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
			}
		}

		.form-list {
			padding: 0 28rpx;

			.form-yzm {
				display: flex;

				.btn-code {
					width: 240rpx;
					height: 72rpx;
					margin-left: 16rpx;
					background-color: #3475D9;
					border-radius: 8rpx;
					color: #ffffff;
					font-size: 28rpx;
				}
			}
		}
	}

	.btn-list {
		width: 702rpx;
		margin: 20rpx 0;
	}
</style>
