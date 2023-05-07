<template>
	<view class="uni_content">
		<view class="detail_box uni_shadow-border">
			<view class="form-list">
				<u-form :model="form" ref="uForm" label-position="top">
					<u-form-item label="请上传处理后的照片或视频" prop="fileIds" required>
						<UploadFile ref="uploadFile" @moveImage="(index, data) => onUploadChange(data)" maxDuration="15"
							placeholder="上传" :uploadUrl="uploadUrl" @onSuccess="onUploadChange">
						</UploadFile>
					</u-form-item>
					<u-form-item label="请输入处理描述" prop="content" required>
						<u-input v-model="form.content" type="textarea" border maxlength="200" />
					</u-form-item>
				</u-form>
			</view>
		</view>
		<view class="btn-list">
			<u-button type="primary" :disabled="submitFlag" @click="handleSubmit">商户处置</u-button>
		</view>
		<u-toast ref="uToast" />
	</view>
</template>
<script>
	import UploadFile from '../../components/uploadFile/uploadFile.vue'
	import { mqwbUrl } from '@/common/config/config'
	export default {
		data() {
			return {
				submitFlag: false,
				uploadUrl: mqwbUrl + '/mqwb/api/file/uploadFile',
				form: {
					caseNo: '',
					content: '',
					fileIds: ''
				},
				rules: {
					fileIds: [{
						required: true,
						message: '请上传至少一个图片或视频',
						trigger: ['change']
					}],
					content: [{
						required: true,
						message: '请输入处理描述',
						trigger: ['blur']
					}]
				}
			}
		},
		components: {
			UploadFile
		},
		methods: {
			// 上传图片内容修改回调
			onUploadChange(data) {
				if (!data.length) {
					this.form.fileIds = ''
					return
				}
				this.form.fileIds = data.map(v => v.id)?.join()
			},
			handleSubmit() {
				this.$refs.uForm.validate(async valid => {
					if (valid) {
						this.submitFlag = true
						uni.showLoading({
							title: '提交中'
						})
						this.$u.api.handleStoreCase(this.form).then(res => {
							if (res.success) {
								this.$refs.uToast.show({
									title: '处置成功',
									type: 'success',
									url: '/pagesE/mqwbEventIssue/index',
									params: {
										tabIndex: 1
									}
								})
							} else {
								this.$refs.uToast.show({
									title: res.message || '处置失败',
									type: 'error'
								})
								this.submitFlag = false
							}
						}).catch(() => {
							uni.hideLoading()
							this.submitFlag = false
						})
					}
				})
			},
		},
		onLoad(option) {
			this.form.caseNo = option.caseNo
		},
		// 必须要在onReady生命周期，因为onLoad生命周期组件可能尚未创建完毕
		onReady() {
			this.$refs.uForm.setRules(this.rules);
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
