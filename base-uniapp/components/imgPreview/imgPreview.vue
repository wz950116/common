<template>
    <view>
		<view v-if="showBox">
			<swiper  class="video_box" :vertical="true" :current="current" @change="swiperChange">
				<swiper-item v-for="(img, index) in imgs" :key="index">
					<swiper class="video_box" :current="currentNext" @change="swiperChange">
						<swiper-item v-for="(item,num) in img.imgList" :key="num">
							<view class="close_box" @click="closeBox">
								x
							</view>
							<view v-if="item.type==='video'" class="current-box">
								<video id="myVideo" :enable-play-gesture="true" :data-id="index" :src="item.src" controls class="video_box-one" 
								:show-fullscreen-btn="false" @play="playVideo" @pause="pauseVideo"></video>
							</view>
							<view v-if="item.type==='image'" class="current-box">
								<image  @click="closeBox"  :src="item.src"   mode="widthFix" class="image_box"></image>
							</view>
							<view v-if="!show" class="bottom-box-two">
								<view @click="show=true" class="iconfont iconshanghua icon-up"></view>
							</view>
							<view class="bottom-box-one" :class="{'active':show}">
								<view class="box-top">
									<view @click="show=false,isMore=false" class="iconfont iconxiala icon-up"></view>
								</view>
								<view class="center-box">
									<view class="left">
										<view class="title">
											{{img.questionTypeName}}
										</view>
										<view class="time">
											{{img.createTime}}
										</view>
									</view>
									<view @click="handleGood(index,img)" class="iconfont icondianzan_yidian icon-zan" :class="{'icondianzan_yidian':img.isThumbUp,'icondianzan_weidian':!img.isThumbUp}"></view>
								</view>
								<view class="center-box">
									<view class="content">
										<view class="content-text" :class="{'active-content-text':isMore,'uni_span_row-two':!isMore}">
											{{img.questionDesc}}
										</view>
										<view class="more-text" @click="isMore = !isMore">
											{{isMore?'收起<<':'更多>>'}}
										</view>
									</view>
									<view class="num">
										{{img.thumbUpCount}}
										<view class="num-no">
											为ta点赞
										</view>
									</view>
								</view>
								<view class="box-area iconfont icondingwei uni_span_row-one">
									{{img.questionAddr}}
								</view>
							</view>
						</swiper-item>
					</swiper>
		        </swiper-item>
			</swiper>
		</view>
    </view>
</template>
<script>
export default {
	props:{
		imgs:{
			type: Array,
			default: []
		},
		current:{
			type: Number,
			default: 0
		},
		currentNext:{
			type: Number,
			default: 0
		},
		showBox:{
			type: Boolean,
			default: false
		}
	},
   data() {
      return {
		isMore: false,
		show: true,
		// imgs: [],
		beNum: null,
		nowNum: null
      }
   },
	methods:{
		handleGood(index,item){
			console.log(this.current)
			this.$emit('upThymb',index,item)
		},
		playVideo(){
			this.beNum = this.nowNum 
		},
		pauseVideo(){
			this.beNum = null
		},
		closeBox(){
			this.$emit('closebox',false);
		},
		swiperChange(e){
			if(e.detail.current!=this.beNum && this.beNum!=null){
				uni.createVideoContext('myVideo').pause()
			}
			this.nowNum = e.detail.current
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
	.current-box{
		position: relative;
		width: 100vw;
		height: 1176rpx;
		/* height: 100%; */
	}
	.video_box-one{
		position: absolute;
		margin: auto;
		width: 100%;
		right: 0;
		bottom: 0;
		top: 0;
		left: 0;
		z-index: 12;	
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
	.bottom-box-one{
		position: absolute;
		bottom: 0;
		background-color: #000000;
		width: 100vw;
		min-height: 272rpx;
		transition-duration: 0.5s;
		transform: translateY(272rpx);
	}
	.active{
		transition-duration: 0.5s;
		transform: translateY(0);
	}
	.content-text{
		width: 554rpx;
		height: 64rpx;
		transition-property: height;
		transition-duration: 0.3s;
		transition-delay: 0.1s;
		transition-timing-function: cubic-bezier(0.25, 0.1, 0.25, 1.0);
	}
	.active-content-text{
		width: 554rpx;
		height: 120rpx;
	}
	.bottom-box-two{
		position: absolute;
		bottom: 0;
		background-color: #000000;
		width: 100vw;
		height: 80rpx;
		text-align: center;
		.icon-up{
			line-height: 80rpx;
			font-size: 64rpx;
			color: #666666;
		}
	}
	.box-top{
		width: 100vw;
		height: 64rpx;
		text-align: center;
		.icon-up{
			font-size: 64rpx;
			color: #666666;
		}
	}
	.center-box{
		display: flex;
		margin-left: 28rpx;
		/* margin-right: 28rpx; */
		.left{
			width: 70%;
			display: flex;
		}
		.title{
			font-size: 28rpx;
			text-align: left;
			color: #ffffff;
			line-height: 40rpx;
		}
		.time{
			margin-left: 16rpx;
			/* width: 300rpx; */
			font-size: 24rpx;
			text-align: left;
			color: #999999;
			line-height: 34rpx;
		}
		.icon-zan{
			width: 30%;
			margin-right: 50rpx;
			text-align: right;
			font-size: 48rpx;
			color: #FF5167;
		}
		.content{
			width: 554rpx;
			font-size: 24rpx;
			color: #FFF;
			text-align: left;
			.more-text{
				text-align: right;
			}
		}
		.num{
			margin-left: 48rpx;
			width: 96rpx;
			text-align: center;
			font-size: 24rpx;
			text-align: center;
			color: #999999;
			line-height: 36rpx;
		}
	}
	.box-area{
		margin-left: 28rpx;
		font-size: 24rpx;
		color: #999999;
		margin-top: 16rpx;
		width: 600rpx;
		margin-bottom: 24rpx;
	}
</style>