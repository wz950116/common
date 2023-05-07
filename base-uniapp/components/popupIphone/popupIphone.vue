<template>
    <view class="uni_content">
		<u-modal @input="handInput" :value="value" :title="title" show-cancel-button @cancel="cancel" @confirm="confirm">
			<view class="input-num">
				<u-input v-model="valueNum" type="number" placeholder="输入手机号" border="border" />
			</view>
			<view class="input-value">
				<u-input class="value" v-model="values" type="number"  placeholder="输入验证码" border="border" />
				<u-verification-code :seconds="seconds" @end="end" @start="start" ref="uCode" 
				@change="codeChange"></u-verification-code>
				<button  @tap="clickSend">{{tips}}</button>
			</view>
		</u-modal>
		<u-toast ref="uToast" />
    </view>
</template>
<script>
export default {
	props:{
		title:{
			type:String,
			default:"填写手机号"
		},
		value: {
			type: null
		}
	},
   data() {
      return {
		  valueNum: null,
		  values: null,
		  isCode: false,
		  inNum: false,
		  seconds: 60,
		  tips: '发送验证码'
      }
   },
   onLoad(){
	   
   },
	methods:{
		codeChange(text) {
			this.tips = text;
		},
		clickSend(){
			if(!(/^1[3456789]\d{9}$/.test(this.valueNum))){
				this.$refs.uToast.show({
					title: '请填写正确的手机号'
				})
				this.inNum = false
			}else{
				this.inNum = true
				if(this.$refs.uCode.canGetCode) {
					// 模拟向后端请求验证码
					uni.showLoading({
						title: '正在获取验证码'
					})
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
			}
			this.$emit('sendNum' , this.valueNum)
		},
		end() {
			// this.$u.toast('倒计时结束');
		},
		start() {
			// this.$u.toast('倒计时开始');
		},
		handInput(v) {
			this.$emit('input',v)
		},
		confirm(){
			if(!this.inNum){
				this.$refs.uToast.show({
					title: '手机号或验证码有误'
				})
				this.$emit('noClose',false)
				this.$emit('input',true)
			}else{
				this.$emit('noClose',true)
				this.$emit('input',false)
				this.$emit('submit',{num:this.valueNum,code:this.values})
			}
		},
		cancel(){
			this.$emit('noClose',true)
			this.$emit('input',false)
		},
	},
}
</script>
<style lang='scss' scoped>
	.input-num{
		height: 72rpx;
		width: 526rpx;
		margin-left: 48rpx;
		margin-top: 28rpx;
	}
	.input-value{
		display: flex;
		margin-top: 20rpx;
		margin-left: 48rpx;
		margin-bottom: 28rpx;
		.value{
			height: 72rpx;
			width: 300rpx;
		}
		button{
			height: 72rpx;
			margin-left: 16rpx;
			background-color: #3475D9;
			border-radius: 8rpx;
			color: #FFF;
			font-size: 28rpx;
		}
	}
</style>