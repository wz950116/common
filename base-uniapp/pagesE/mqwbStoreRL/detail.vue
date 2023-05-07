<template>
	<view class="uni_content">
		<view class="detail_box uni_shadow-border">
			<u-line color="#EBEBEB"></u-line>
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
					法定代表人
				</view>
				<view class="text-right">
					{{detailList.legalRepresentative}}
				</view>
			</view>
			<u-line color="#EBEBEB"></u-line>
			<view class="box-current">
				<view class="text-left">
					统一社会代码
				</view>
				<view class="text-right">
					{{detailList.uniformCreditCode}}
				</view>
			</view>
			<u-line color="#EBEBEB"></u-line>
			<view class="box-current">
				<view class="text-left">
					经营类型
				</view>
				<view class="text-right">
					{{detailList.storeTypeDesc}}
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
				<view class="area-title">
					详细地址
				</view>
				<view class="text-right">
					{{detailList.address}}
				</view>
			</view>
		</view>
		<view class="btn-list">
			<u-button type="primary" @click="handleSubmit">认领商户</u-button>
		</view>
	</view>
</template>
<script>
	export default {
		data() {
			return {
				detailList: {}
			}
		},
		methods: {
			init(id) {
				this.$u.api.findStoreBaseByIdv2({
					storeBaseId: id
				}).then(({ data, success }) => {
					if (success) {
						this.detailList = data
					}
				})
			},
			handleSubmit() {
				uni.navigateTo({
					url: './confirm?id=' + this.detailList.id
				})
			}
		},
		onLoad(option) {
			this.init(option.id)
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
	}
	.btn-list {
		width: 702rpx;
		margin: 20rpx 0;
	}
</style>
