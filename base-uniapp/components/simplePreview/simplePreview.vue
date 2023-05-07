<template>
    <view v-if="vidoeFlag">
    	<swiper  class="video_box"  :current="current" @change="swiperChange">
    		<swiper-item v-for="(upload, index) in uploads" :key="index">
    			<view class="close_box" @click="closeBox">
    				x
    			</view>
    			<!-- <view v-if="upload.type==='video'">
    				<video id="myVideo" :enable-play-gesture="true" :data-id="index":src="upload.videoSrc" controls class="video_box" 
    				:show-fullscreen-btn="false" @play="playVideo" @pause="pauseVideo"></video>
    			</view> -->
    			<view>
    				<image @click="closeBox" :src="upload" mode="widthFix" class="image_box"></image>
    			</view>
            </swiper-item>
    	</swiper>
    </view>
</template>
<script>
export default {
	props:{
		vidoeFlag:{
			type: Boolean,
			default: false
		},
		uploads:{
			type: Array,
			default: []
		},
		current:{
			type: Number,
			default: 0
		}
	},
   data() {
      return {
		beNum: null,
		nowNum: null
      }
   },
	methods:{
		swiperChange(e){
			if(e.detail.current!=this.beNum && this.beNum!=null){
				uni.createVideoContext('myVideo').pause()
			}
			this.nowNum = e.detail.current
		},
		closeBox(){
			this.$emit('isClose',false)
		},
		pauseVideo(){
			this.beNum = null
		},
		playVideo(){
			this.beNum = this.nowNum 
		},
	},
}
</script>
<style lang='scss' scoped>
	.video_box{
		background-color: #000000;
		width: 100vw;
		height: 100vh;
		position: fixed;
		z-index: 10;
		right: 0;
		bottom: 0;
		top: 0;
		left: 0;
	}
	.image_box{
		position: absolute;
		margin: auto;
		width: 100%;
		right: 0;
		bottom: 0;
		top: 0;
		left: 0;
		z-index: 12;
	}
	.close_box{
		position: fixed;
		top: 30rpx;
		left: 30rpx;
		z-index: 13;
		color: #fff;
		height: 30rpx;
		width: 30rpx;
		font-size: 60rpx;
	}
</style>