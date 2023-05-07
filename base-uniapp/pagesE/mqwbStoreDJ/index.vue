<template>
	<view class="uni_content">
		<view class="form-list">
			<u-form :model="form" ref="uForm" label-position="top">
				<u-form-item label="商户名称" prop="storeName" :label-width="labelWidth" required>
					<u-input v-model="form.storeName" />
				</u-form-item>
				<u-form-item label="统一社会信用代码" prop="uniformCreditCode" :label-width="labelWidth" required>
					<u-input v-model="form.uniformCreditCode" />
				</u-form-item>
				<u-form-item label="法定代表人" prop="legalRepresentative" label-width="120" required>
					<u-input v-model="form.legalRepresentative" />
				</u-form-item>
				<u-form-item label="经营类型" prop="storeTypeName" label-width="120" required>
					<view class="my-select">
						<u-input v-model="form.storeTypeName" type="select" placeholder="请选择"
							@click="showStoreType = true" />
						<u-select v-model="showStoreType" height="560rpx" :safe-area-inset-bottom="true"
							label-name="codeDesc" value-name="codeValue" :list="storeTypeList" @confirm="onStoreType">
						</u-select>
					</view>
				</u-form-item>
				<u-form-item label="经营状态" prop="operationStatusName" label-width="120" required>
					<view class="my-select">
						<u-input v-model="form.operationStatusName" type="select" placeholder="请选择"
							@click="showOperationStatus = true" />
						<u-select v-model="showOperationStatus" height="560rpx" :safe-area-inset-bottom="true"
							label-name="codeDesc" value-name="codeValue" :list="operationStatusList"
							@confirm="onOperationStatus">
						</u-select>
					</view>
				</u-form-item>
				<u-form-item label="负责人" prop="principal" label-width="120" required>
					<u-input v-model="form.principal" />
				</u-form-item>
				<u-form-item label="联系电话" prop="principalTel" label-width="120" required>
					<u-input v-model="form.principalTel" />
				</u-form-item>
				<u-form-item label="负责人证件类型" prop="principalIdTypeName" label-width="120" required>
					<view class="my-select">
						<u-input v-model="form.principalIdTypeName" type="select" placeholder="请选择"
							@click="showPrincipalIdType = true" />
						<u-select v-model="showPrincipalIdType" height="560rpx" :safe-area-inset-bottom="true"
							label-name="codeDesc" value-name="codeValue" :list="certTypeList"
							@confirm="onPrincipalIdType">
						</u-select>
					</view>
				</u-form-item>
				<u-form-item label="负责人证件号" prop="principalIdCode" label-width="120" required>
					<u-input v-model="form.principalIdCode" />
				</u-form-item>
				<u-form-item label="所属区域" prop="areaInfo" label-width="120" required>
					<u-input v-model="form.areaInfo" disabled placeholder="地图选中后,自动获取" />
				</u-form-item>
				<u-form-item label="商户地址" prop="address" label-width="120" required>
					<view class="my-select" @click="showMap = true">
						<u-input v-model="form.address" placeholder="请选择坐标获取" />
						<u-icon class="icon-location" name="map-fill" color="#2979ff" size="36"></u-icon>
					</view>
				</u-form-item>
				<u-form-item label="营业执照" prop="storeLicense" label-width="120" required>
					<UploadFile ref="uploadFile" @moveImage="(index, data) => onUploadChange(data, 'storeLicense')"
						maxDuration="15" placeholder="上传" :uploadUrl="uploadUrl" :types="['image']"
						@onSuccess="data => onUploadChange(data, 'storeLicense')">
					</UploadFile>
				</u-form-item>
				<u-form-item label="负责人证件照" prop="principalPhoto" label-width="120" required>
					<UploadFile ref="uploadFile" @moveImage="(index, data) => onUploadChange(data, 'principalPhoto')"
						maxDuration="15" placeholder="上传" :uploadUrl="uploadUrl" :types="['image']"
						@onSuccess="data => onUploadChange(data, 'principalPhoto')">
					</UploadFile>
				</u-form-item>
				<u-form-item label="商户照片" prop="storePhoto" label-width="120" required>
					<UploadFile ref="uploadFile" @moveImage="(index, data) => onUploadChange(data, 'storePhoto')"
						maxDuration="15" placeholder="上传" :uploadUrl="uploadUrl" :types="['image']"
						@onSuccess="data => onUploadChange(data, 'storePhoto')">
					</UploadFile>
				</u-form-item>
				<u-form-item label="验证码" prop="authCode" label-width="120" required>
					<view class="form-yzm">
						<u-input class="value" v-model="form.authCode" type="number" placeholder="输入验证码" />
						<u-verification-code :seconds="60" ref="uCode" @change="codeChange">
						</u-verification-code>
						<button class="btn-code" @tap="clickSend">{{tips}}</button>
					</view>
				</u-form-item>
			</u-form>
		</view>
		<view class="btn-list">
			<u-button v-if="mobile" type="primary" :disabled="submitFlag" @click="handleSubmit">确定
			</u-button>
			<u-button v-else type="primary" :disabled="submitFlag" open-type="getPhoneNumber"
				@getphonenumber="handleSubmit">确定
			</u-button>
		</view>
		<map-dialog v-if="showMap" :latitude="form.latitude" :longitude="form.longitude" @confirm="onMapConfirm">
		</map-dialog>
		<u-toast ref="uToast" />
	</view>
</template>
<script>
	import UploadFile from '../../components/uploadFile/uploadFile.vue'
	import MapDialog from '@/components/mapDialog/mapDialog.vue'
	import {
		mqwbUrl
	} from '@/common/config/config'
	export default {
		data() {
			return {
				submitFlag: false,
				tips: '获取验证码',
				storeTypeList: [],
				operationStatusList: [],
				certTypeList: [],
				showStoreType: false,
				showOperationStatus: false,
				showPrincipalIdType: false,
				showCertType: false,
				showMap: false,
				labelWidth: 120,
				uploadUrl: mqwbUrl + '/mqwb/api/file/uploadFile',
				mobile: '',
				currentPoint: {
					longitude: '',
					latitude: ''
				},
				form: {
					storeName: '',
					uniformCreditCode: '',
					legalRepresentative: '',
					storeType: '',
					storeTypeName: '',
					operationStatus: '',
					operationStatusName: '',
					principal: '',
					principalTel: '',
					principalIdType: '',
					principalIdTypeName: '',
					principalIdCode: '',
					district: '',
					districtCode: '',
					street: '',
					streetCode: '',
					community: '',
					communityCode: '',
					address: '',
					storeLicense: '',
					principalPhoto: '',
					storePhoto: '',
					authCode: '',
					longitude: '',
					latitude: '',
					areaInfo: ''
				},
				rules: {
					storeName: [{
						required: true,
						message: '请输入商户名称',
						trigger: ['blur']
					}],
					uniformCreditCode: [{
						required: true,
						message: '请输入统一社会信用代码',
						trigger: ['blur']
					}, {
						asyncValidator: (rule, value, callback) => {
							this.$u.api.findByUniformCreditCode({
								uniformCreditCode: value
							}).then(({
								data
							}) => {
								if (!data) {
									callback(new Error('提示：当前商户已在系统中完成备案，无需再登记'))
								} else {
									callback()
								}
							})
						},
						trigger: ['blur']
						// 如果是异步校验，无需写message属性，错误的信息通过Error抛出即可
					}],
					legalRepresentative: [{
						required: true,
						message: '请输入法定代表人',
						trigger: ['blur']
					}],
					storeTypeName: [{
						required: true,
						message: '请选择经营类型',
						trigger: ['change']
					}],
					operationStatusName: [{
						required: true,
						message: '请选择经营状态',
						trigger: ['change']
					}],
					principal: [{
						required: true,
						message: '请输入负责人',
						trigger: ['blur']
					}],
					principalTel: [{
						required: true,
						message: '请输入联系电话',
						trigger: ['blur']
					}],
					principalIdTypeName: [{
						required: true,
						message: '请输入负责人证件类型',
						trigger: ['change']
					}],
					principalIdCode: [{
						required: true,
						message: '请选择负责人证件号',
						trigger: ['blur']
					}],
					areaInfo: [{
						required: true,
						message: '请选择所属区域',
						trigger: ['blur']
					}],
					address: [{
						required: true,
						message: '请选择坐标获取',
						trigger: ['change', 'blur']
					}],
					storeLicense: [{
						required: true,
						message: '请上传营业执照',
						trigger: ['change']
					}],
					principalPhoto: [{
						required: true,
						message: '请上传负责人证件照',
						trigger: ['change']
					}],
					storePhoto: [{
						required: true,
						message: '请上传商户照片',
						trigger: ['change']
					}],
					authCode: [{
						required: true,
						message: '请输入验证码',
						trigger: ['blur']
					}]
				}
			}
		},
		components: {
			UploadFile,
			MapDialog
		},
		methods: {
			init(id) {
				this.$u.api.queryEnumByEnumType({
					enumType: 'STORE_TYPE'
				}).then(({
					data,
					success
				}) => {
					if (success) {
						this.storeTypeList = data || []
					}
				})
				this.$u.api.queryEnumByEnumType({
					enumType: 'OPERATION_STATUS'
				}).then(({
					data,
					success
				}) => {
					if (success) {
						this.operationStatusList = data || []
					}
				})
				this.$u.api.queryEnumByEnumType({
					enumType: 'CERT_TYPE'
				}).then(({
					data,
					success
				}) => {
					if (success) {
						this.certTypeList = data || []
					}
				})
			},
			// 地图选择回调
			onMapConfirm(val) {
				if (val) {
					if (!val.streetCode || !val.streetCode.trim()) {
						this.$u.toast('所属区域不在范围内，请重试。')
						return
					}
					if (!val.communityCode || !val.communityCode.trim()) {
						this.$u.toast('所属区域不在范围内，请重试。')
						return
					}
					this.form.latitude = val.latitude
					this.form.longitude = val.longitude
					this.form.address = val.address
					this.form.district = val.district
					this.form.districtCode = val.districtCode
					this.form.street = val.street
					this.form.streetCode = val.streetCode
					this.form.community = val.community
					this.form.communityCode = val.communityCode
					this.form.areaInfo = this.form.district + this.form.street + this.form.community
				}
				this.showMap = false
			},
			codeChange(text) {
				this.tips = text
			},
			async clickSend() {
				// if (!this.$u.test.mobile(this.form.principalTel)) {
				// 	this.$u.toast('请填写正确的手机号')
				// 	return false
				// }
				const res = await this.$u.api.getStoreBaseAuthCode({
					claimTel: this.form.principalTel
				})
				if (res.data) {
					if (this.$refs.uCode.canGetCode) {
						uni.showLoading({
							title: '正在获取验证码'
						})
						// 模拟向后端请求验证码
						setTimeout(() => {
							uni.hideLoading();
							// 这里此提示会被this.start()方法中的提示覆盖
							this.$u.toast('验证码已发送');
							// 通知验证码组件内部开始倒计时
							this.$refs.uCode.start();
						}, 2000);
					} else {
						this.$u.toast('倒计时结束后再发送');
					}
				} else {
					this.$u.toast('发送失败');
				}
			},
			// 上传图片内容修改回调
			onUploadChange(data, item) {
				if (!data.length) {
					this.form[item] = ''
					return
				}
				this.form[item] = data.map(v => v.id)?.join()
			},
			onStoreType(val) {
				this.form.storeType = val[0]?.value
				this.form.storeTypeName = val[0]?.label
			},
			onOperationStatus(val) {
				this.form.operationStatus = val[0]?.value
				this.form.operationStatusName = val[0]?.label
			},
			onPrincipalIdType(val) {
				this.form.principalIdType = val[0]?.value
				this.form.principalIdTypeName = val[0]?.label
			},
			async handleSubmit(e) {
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
				this.$refs.uForm.validate(valid => {
					if (valid) {
						this.submitFlag = true
						uni.showLoading({
							title: '提交中'
						})
						this.$u.api.createStoreBase({
							...this.form,
							claimAccount: getApp().globalData.userName,
							claimId: getApp().globalData.userId,
							claimTel: this.mobile
						}).then(res => {
							if (res.success) {
								this.$refs.uToast.show({
									title: '登记成功',
									type: 'success',
									back: true
								})
							} else {
								this.$refs.uToast.show({
									title: res.message || '登记失败',
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
		onLoad() {
			this.mobile = getApp().globalData.mobile
			this.init()
			// 默认为当前用户位置
			this.form.latitude = Number(getApp().globalData.lat)
			this.form.longitude = Number(getApp().globalData.lon)
		},
		// 必须要在onReady生命周期，因为onLoad生命周期组件可能尚未创建完毕
		onReady() {
			this.$refs.uForm.setRules(this.rules)
		}
	}
</script>
<style lang='scss' scoped>
	.form-list {
		width: 702rpx;
		height: calc(100vh - 142rpx);
		margin-top: 24rpx;
		background-color: #FFF;
		padding: 0 28rpx;
		overflow-y: auto;

		.my-select {
			display: flex;
			justify-content: space-between;

			u-input {
				flex: 1;
			}

			.icon-location {
				display: block;
				width: 80rpx;
				text-align: right;
			}
		}

		.form-yzm {
			display: flex;
			justify-content: space-between;

			.btn-code {
				width: 240rpx;
				height: 72rpx;
				margin-left: 16rpx;
				margin-right: 0;
				background-color: #3475D9;
				border-radius: 8rpx;
				color: #ffffff;
				font-size: 28rpx;
			}
		}
	}

	.btn-list {
		width: 702rpx;
		margin: 20rpx 0;
	}

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
