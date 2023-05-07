<template>
	<view>
		<view class="uni_content" v-if="isInit">
			<view class="news_top top_heigt">
				<view class="uni_conetnt-xing">
					*<span class="uni_conetnt-title">照片或小视频</span>
					<span class='news_right-text' @click="clickBreakHelpers">爆料助手</span>
				</view>
				<view class="news_top-test">
					可上传图片和小视频，图片最多3张，小视频最多3个，小视频时长最多15秒
				</view>
				<view class="UploadFile">
					<UploadFile ref="uploadFile" @moveImage="moveImage" maxDuration="15" imageCount="3" videoCount="3" @onSuccess="onSuccess"></UploadFile>
				</view>
			</view>
			<view class="news_top news_qes">
				<view class="uni_conetnt-xing">
					*<span class="uni_conetnt-title">问题描述</span>
					<image :src="require('../../static/sing_icon.png')" class="sing_icon"  @click="showVoice=true"></image>
				</view>
				<view class="news_textarea">
					<textarea v-model="voiceState" placeholder="请填写问题发生的时间、地址及具体情况"
					placeholder-class="placeholder_class" @input="textareaChange" maxlength="500"/>
				</view>
				<view class="news_textarea-text">
					<span>{{length}}/500中文字</span>
				</view>
			</view>
			<view class="qes_type news_top">
				<view class="uni_conetnt-xing" @click="clickSelect">
					*<span class="uni_conetnt-title">问题类型</span>
					<view class="news_qes-text">{{qesType}}</view>
					<u-icon name="arrow-right" color="#BFBFBF" size="32" class="news_type-icon"></u-icon>
				</view>
			</view>
			<view class="news_qesType news_top">
				<view class="uni_conetnt-xing">
					*<span class="uni_conetnt-title">现场地址</span>
					<image :src="require('../../static/area_icon.png')" class="area_icon" @click="cilckArea"></image>
				</view>
				<view class="news_area-text">
					{{address}}
				</view>
			</view>
			<view class="news_bottom news_top">
				<view class="uni_conetnt-xing">
					<span class="uni_conetnt-title">看看周边爆料</span>
				</view>
				<view class="news_around">
					<image :src="item.coverImgUrl||item.reportVideos[0].imgUrl" v-for="(item,index) in coverImages" @click="handleImgOpen(item.discloseId)" :key="index"></image>
					<image v-if="nearbyList&&nearbyList.length>3" :src="require('../../static/more.png')" @click="handleImgPreview"></image>
					<div v-else class="no-content">周边暂无爆料</div>
				</view>
			</view>
			<view class="news_btn-box">
				<button @click="$u.debounce(handleSubmit, 500)" :disabled="submitFlag">提交</button>
			</view>
			<!-- <u-select v-model="selectFlag" :list="selectList" @confirm="selectDate"></u-select> -->
	 
			<view class="">
				<u-select v-model="selectFlag" height="560rpx" :safe-area-inset-bottom="true" mode="mutil-column-auto" label-name="name" value-name="code" :list="selectList" @confirm="selectDate"></u-select>
			</view>
			<u-popup v-model="showVoice" mode="bottom" height="560rpx" closeable @open="voiceText=''" @close="closePopup()"
			border-radius="48">
				<view style="overflow: hidden;">
					<view class="vioce-box-text">
						<textarea v-model="voiceText"  maxlength="150" class="textarea" />
					</view>
					<view class="vioce-box-icon">
						<view class="vioce-box-height"><p v-show="voiceTextFlag">按住说话</p></view>
							<view class="vioce-box-text-left">
								<span v-show="voiceText!=''" @click="voiceText=''">清空</span>
							</view>
							<image style="margin-left: 15rpx;float: left;" :src="require('../../static/sytb@2x.png')"
								@touchstart="touchStart" @touchend="touchEnd"></image>
							<view class="vioce-box-text-right">
								<span v-show="voiceText!=''" @click="showVoice=false">确定</span>
							</view>
					</view>
				</view>
			</u-popup>
		</view>
		<imgPreview :imgs="dataList" :current="currentNext" :showBox="showBox" @closebox="val =>showBox=val" @upThymb="upThymb"></imgPreview>
		<view class="uni_content" v-if="isSubmit">
			<view class="submit-box">
				<view class="sub-top-box">
					<view class="title">
						爆料提交成功！
					</view>
					<!-- <button v-if="!isShare">关注</button> -->
				</view>
				<view class="sub-time">
					{{hisForm.reportTimeStr}}
				</view>
				<view class="sub-type">
					问题类型：<span>{{hisForm.questionTypeName}}</span></br>
				</view>
				<view class="sub-detail">
					问题描述：<span>{{hisForm.questionDesc}}</span>
				</view>
				<view class="iconfont icondingwei icon-area">
					{{hisForm.questionAddr}}
				</view>
				<u-line color="#EBEBEB" length="646rpx" margin="26rpx 0rpx"></u-line>
				<block v-for="(file, index) in uploads" :key="index">
					<view class="img">
						<image :src="file.src" v-if="file.type=='image'" class="img-box" @tap="preview(index)"></image>
						<image class="img-box" v-if="file.type=='video'" :src="file.src" @tap="preview(index)"></image>
						<image v-if="file.type=='video'" :src="require('../../static/video_icon.png')" class="video_icon" @tap="preview(index)"></image>
					</view>
				</block>
				<view class="sub-btn" v-if="!isShare">
					<button  class="confirm" plain @click="handleConfirm">确认</button>
				</view>
			</view>
			<view class="submit-around-box"  v-if="!isShare">
				<view class="around-top-flex">
					<view class="title">
						围观周边
					</view>
					<view class="iconfont icongengduo more" @click="showBox=true"></view>
				</view>
				<u-line color="#EBEBEB" margin="30rpx 0rpx"></u-line>
				<view class="around-content-box" v-for="(item, index) in coverImages" :key="index">
					<image :src="item.coverImgUrl"></image>
					<view class="content-center">
						<view class="title">
							{{item.questionTypeName}}
						</view>
						<view class="content uni_span_row-two">
							{{item.questionDesc}}
						</view>
					</view>
					<view class="content-right">
						<view @click="clickGood(index,item)" class="iconfont icon-zan" :class="{'icondianzan_yidian':item.isThumbUp,'icondianzan_weidian':!item.isThumbUp}"></view>
						<view class="num">
							{{item.thumbUpCount}}
						</view>
						<view class="text">
							为ta点赞
						</view>
					</view>
				</view>
			</view>
		</view>
		<SimplePreview @isClose="val =>show=val" :vidoeFlag="show" :current="current" :uploads="uploads"></SimplePreview>
		<PopupIphone  @sendNum="sendNum" @noclose="val =>isupdate=val" v-model="isupdate" @submit="submit"></popupIphone>
	</view>
</template>
<script>
import UploadFile from '../../components/uploadFile/uploadFile.vue'
import imgPreview from '../../components/imgPreview/imgPreview.vue'
import PopupIphone from '../../components/popupIphone/popupIphone.vue'
import SimplePreview from '../../components/simplePreview/simplePreview.vue'
var plugin = requirePlugin("WechatSI")
let manager = plugin.getRecordRecognitionManager()
export default {
   data() {
      return {
		submitFlag: false,
		dataList: [],
		nearbyList: [],
		showIndex:0,
		coverImages: [],
		newsTime: new Date(),
		show: false,
		uploads: [],
		current: 0,
		hisForm: '',
		isupdate: false,
		showBox: false,
		isShare: false,
		isInit: true,
		isSubmit: false,
		voiceTextFlag: true,
		voiceText:'',  
		showVoice: false,
		qesType: '',
		qesTypeNum: null,
		typeCode: null,
		typeName: '',
		mainTypeCode: null,
		mainTypeName: '',
		subTypeCode: null,
		subTypeName: '',
		selectFlag: false,
		selectList: [],
		srcVideo: [],
		srcImage: [],
		voiceState: '',
		length: 0,
		latitude: null,
		longitude: null,
		address: '',
		shareId: '',
		currentNext:0,
		columns: [],       //省份数据显示，三级联动需要三维数组，展示初始数据
		columnData: [],    //市数据
		columnDatas: [],
		selected: [0, 0, 0]
      }
   },
   components:{
	   UploadFile,imgPreview,PopupIphone,SimplePreview
   },
   onShareAppMessage(){ //分享好友
		if(isSubmit){
			return {
				 path: '/pages/breakNews/index?id='+this.shareId
			}
		}
		else{
			return
		}
   },
   onShareTimeline(){ //分享朋友圈
		if(isSubmit){
			return {
				query: 'id='+this.shareId,
				imageUrl:''
			}
		}else{
			return
		}
   },
   onLoad(option){
	   if(option.id!=undefined){ //是否分享
		   this.shareOpen(option.id)
	   }else{
		this.getQesType()
		this.getNearbyImage()   
	   }
	   this.initRecord();
		uni.showShareMenu({
			withShareTicket: true,
			menus: ['shareAppMessage', 'shareTimeline']
		})
   },
   mounted() { //获取经纬度地址
		let  flag = false
		setTimeout(() =>{
			uni.$once('update',(data) => {
				this.init()
				flag = true
			})
			if(!flag){
				this.init()
			}
		},1000)
   },
	methods:{
		init(){
			this.latitude = getApp().globalData.lat
			this.longitude = getApp().globalData.lon
			this.address = getApp().globalData.address
		},
		shareOpen(discloseId){ //分享
			this.isInit = false
			this.isSubmit = true
			this.isShare = true
			this.$u.api.getDisclose(`/common/sys/disclose/${discloseId}`).then(res =>{
				this.hisForm = res.data
				this.uploads = []
				if(this.hisForm.reportImgUrls.length>0){
					this.hisForm.reportImgUrls.forEach((item,index) =>{
						this.uploads.push({type:'image',src:item})
					})
				}
				if(this.hisForm.reportVideos.length>0){
					this.hisForm.reportVideos.forEach((item,index) =>{
						this.uploads.push({type:'video',src:item.imgUrl,videoSrc:item.videoUrl})
					})
				}
			})
		},
		async getQesType(){ //获取问题类型
			let { data, success } = await this.$u.api.getQuestionType()
			if(success){
				const list = []
				 Object.entries(data).forEach(([key,value])=>{
					//  list.push({value:key,label:value})
					list.push(value)
				 })
				 this.selectList = this.getTreeData(data)
			}
		},
		getTreeData(data) {
			for (var i = 0; i < data.length; i++) {
				if (data[i].children.length < 1) {
				// children若为空数组，则将children设为undefined
				// data[i].children = undefined
				delete data[i].children
				} else {
				// children若不为空数组，则继续 递归调用 本方法
				this.getTreeData(data[i].children)
				}
			}
			return data
		},
		preview(index){ //预览图片
			this.show = true
			this.current = index
		},
		clickGood(index,item){
			if(!item.isThumbUp){
				this.$u.api.upThumb(`/disclose/thumb-up/${item.discloseId}`).then(res =>{
					this.coverImages[index].isThumbUp = true
					this.coverImages[index].thumbUpCount++
				})
			}else{
				this.$u.api.upThumb(`/disclose/thumb-up/${item.discloseId}`).then(res =>{
					this.coverImages[index].isThumbUp = false
					this.coverImages[index].thumbUpCount--
				})
			}
		},
		upThymb(index,item){ //点赞
			if(!item.isThumbUp){
				this.$u.api.upThumb(`/disclose/thumb-up/${item.discloseId}`).then(res =>{
					this.dataList[index].isThumbUp = true
					this.dataList[index].thumbUpCount++
				})
			}else{
				this.$u.api.upThumb(`/disclose/thumb-up/${item.discloseId}`).then(res =>{
					this.dataList[index].isThumbUp = false
					this.dataList[index].thumbUpCount--
				})
			}
		},
		resetForm(){ //表单重置
			this.$nextTick(()=>{
				this.$refs.uploadFile.reset()
			})
			this.srcVideo = []
			this.srcImage = []
			this.latitude = null
			this.longitude = null
			this.address = ''
			this.voiceState = ''
			this.qesType = ''
			this.qesTypeNum = null
			this.typeCode = null
			this.typeName = ''
			this.mainTypeCode = null
			this.mainTypeName = ''
			this.subTypeCode = null
			this.subTypeName = ''
		},
		submit(e){ //手机号
			getApp().globalData.mobile = e.num
			uni.setStorage({
			    key: 'mobile',
			    data: e.num,
			    success: ()=>{}
			})
			this.handleSubmit()
		},
		sendNum(e){ //手机号
			console.log(e)
		},
		async getNearbyImage(){
			const { data } =  await this.$u.api.getNearbyList({
				longitude:getApp().globalData.lon,
				latitude:getApp().globalData.lat,
				distance: 500
			})
			console.log(data)
			this.nearbyList = data
			if(this.nearbyList.length>3){
				this.coverImages = data.slice(0,3)
			}else{
				this.coverImages = data
			}
			console.log(this.coverImages)
			const imgsList = []
			data.forEach((item,index) =>{
				const list = []
				if(item.reportImgUrls.length>0){
					item.reportImgUrls.forEach((n,index) =>{
						list.push({type: 'image',src:n})
					})
				}
				if(item.reportVideos.length>0){
					item.reportVideos.forEach((m,index) =>{
						list.push({type: 'video',src:m.videoUrl})
					})
				}
				if(list.length>0){
					imgsList.push({...item,imgList:list})
				}else{
					list.push({type: 'image',src:item.coverImgUrl})
					imgsList.push({...item,imgList:list})
				}
			})
			this.dataList = imgsList
			console.log(this.dataList)
		},
		handleImgPreview(){ //查看周边
			this.showIndex++
			if(this.showIndex===this.nearbyList.length){
				this.showIndex=0
				this.coverImages=this.nearbyList.slice(0,3)
			}else if(this.showIndex+3>this.nearbyList.length){
				this.coverImages=this.nearbyList.slice(this.showIndex,this.nearbyList.length).concat(this.nearbyList.slice(0,this.showIndex+3-this.nearbyList.length))
			}else{
				this.coverImages=this.nearbyList.slice(this.showIndex,this.showIndex+3)
			}
		},
		handleImgOpen(val){
			this.nearbyList.forEach((item,index)=>{
				if(item.discloseId===val){
					this.currentNext=index 
					return;
				} 
			})
			this.showBox=true
		},
		toNext() {
			setTimeout(() =>{
				uni.showLoading({
				    title: '提交中'
				});
			},200)
		},
		handleSubmit(){ //提交表单
			if(this.srcImage.length === 0 && this.srcVideo.length === 0 ){
				uni.showToast({
					title: '请上传图片或小视频',
					icon: 'none'
				})
				return
			}
			if(this.voiceState.length === 0){
				uni.showToast({
					title: '请填写问题描述',
					icon: 'none'
				})
				return
			}
			if(this.qesTypeNum == null){
				uni.showToast({
					title: '请选择问题类型',
					icon: 'none'
				})
				return
			}
			if(this.latitude == null){
				uni.showToast({
					title: '请选择现场地址',
					icon: 'none'
				})
				return
			}
			if(getApp().globalData.mobile==''||getApp().globalData.mobile==undefined){
				this.isupdate = true
			}else{
				if(this.srcImage.length>0){
					this.srcImage.forEach((item,index) =>{
						this.uploads.push({type:'image',src:item})
					})
				}
				if(this.srcVideo.length>0){
					this.srcVideo.forEach((item,index) =>{
						this.uploads.push({type:'video',src:item.imgUrl,videoSrc:item.videoUrl})
					})
				}
				let form = {
					wxName: getApp().globalData.nickName,
					mobile: getApp().globalData.mobile,
					latitude: Number(this.latitude),
					longitude: Number(this.longitude),
					questionAddr: this.address,
					questionDesc: this.voiceState,
					questionSource: 1,
					// questionType: Number(this.qesTypeNum),
					questionType: 7,
					typeCode: this.typeCode,
					typeName: this.typeName,
					mainTypeCode: this.mainTypeCode,
					mainTypeName: this.mainTypeName,
					subTypeCode: this.subTypeCode,
					subTypeName: this.subTypeName,
					reportImgs: this.srcImage.join(';'),
					reportVideos: this.srcVideo,
					sex: getApp().globalData.gender
				}
				this.submitFlag = true
				this.$u.throttle(this.toNext, 500)
				this.$u.api.addDisclose(JSON.stringify(form)).then(res =>{
					this.submitFlag = false
					if(res.success){
						this.shareId = res.data
						this.hisForm = form
						this.hisForm.questionTypeName = this.qesType
						this.hisForm.reportTimeStr = this.getDayTimer()
						this.resetForm()
						setTimeout(() => {
							uni.hideLoading();
							uni.showToast({
								title: '提交成功'
							})
							this.isInit = false
							this.isSubmit = true
						}, 1000)
					}else{
						setTimeout(() => {
							uni.hideLoading();
							uni.showToast({
								icon: 'none',
								title: '提交失败'
							})
						}, 1000)
					}
				})
			}
		},
		getDayTimer () { //获取当前时间
		  var date = new Date()
		  var y = date.getFullYear()
		  var m = date.getMonth() + 1
		  m = m < 10 ? ('0' + m) : m
		  var d = date.getDate()
		  d = d < 10 ? ('0' + d) : d
		  var currentdate = y + '-' + m + '-' + d
		  var hh = date.getHours()
		  hh = hh < 10 ? ('0' + hh) : hh
		  var mm = date.getMinutes()
		  mm = mm < 10 ? ('0' + mm) : mm
		  var ss = date.getSeconds()
		  ss = ss < 10 ? ('0' + ss) : ss
		  var time = hh + ':' + mm + ':' + ss
		  return currentdate + ' ' + time
		},
		handleConfirm(){ //返回表单
			this.isInit = true
			this.isSubmit = false
		},
		closePopup(){ //语音输入关闭窗
			this.voiceState = this.voiceState + this.voiceText
			if(this.voiceState.length>150){
				this.length = 150
				this.voiceState = this.voiceState.substring(0,150)
			}
			else{
				this.length = this.voiceState.length
			}
		},
		touchStart: function() {
			this.voiceTextFlag = false
			manager.start({
				duration: 60000,
				lang: "zh_CN"
			});
			uni.showLoading({
				title: '正在语音输入'
			});
		},
		touchEnd: function() {
			this.voiceTextFlag = true
			uni.hideLoading();
			uni.showToast({
				title: '语音输入完成',
				duration: 500
			})
			manager.stop();
		},
		/**  
		 * 初始化语音识别回调  
		 * 绑定语音播放开始事件  
		 */
		initRecord: function() {
			manager.onStart = function(res) {
				this.voiceText = "onStart:" + res.msg + "正在录音"
			};
			//有新的识别内容返回，则会调用此事件  
			manager.onRecognize = (res) => {
				this.voiceText = this.voiceText + res.result.replace('。','');
			}
			// 识别结束事件  
			manager.onStop = (res) => {
				this.voiceText = this.voiceText + res.result.replace('。','');
			}
			// 识别错误事件  
			manager.onError = (res) => {
				// this.voiceState = this.voiceState + res.msg;
				// this.length = this.voiceState.length
			}
		},
		selectDate(e){  //选择问题类型
		console.log(e, 'eeeeeeeeeeeeeeeee')
			this.qesType = e[0].label + '/' + e[1].label + '/'+ e[2].label
			this.qesTypeNum = e[0].value + '/' + e[1].value + '/'+ e[2].value
			this.typeCode = e[0].value
			this.typeName = e[0].label
			this.mainTypeCode = e[1].value
			this.mainTypeName = e[1].label
			this.subTypeCode = e[2].value
			this.subTypeName = e[2].label
		},
		clickSelect(){
			this.selectFlag = true
		},
		moveImage(index, data){ //删除上传图片
			this.srcImage = []
			this.srcVideo = []
			data.forEach((item,index) =>{
				if(item.type == 'image'){
					this.srcImage.push(item.src)
				}
				else if(item.type == 'video'){
					this.srcVideo.push({imgUrl:item.src,videoUrl:item.videoSrc})
				}
			})
		},
		onSuccess(data){  //上传图片成功回调
			this.srcImage = []
			this.srcVideo = []
			data.forEach((item,index) =>{
			if(item.type == 'image'){
				this.srcImage.push(item.src)
				if(item.questionType){
					this.qesType = this.selectList.find(val => val.value == item.questionType).label
					this.qesTypeNum = item.questionType
				}
			}
			else if(item.type == 'video'){
				this.srcVideo.push({imgUrl:item.src,videoUrl:item.videoSrc})
			}
			})
		},
		textareaChange(e){ //问题描述输入
			if(e.target.value.length > 500){
				this.length = 500
			}else{
				this.length = e.target.value.length
			}
		},
		clickBreakHelpers(){ //爆料助手
			uni.navigateTo({
				url: '../breakHelpers/index'
			})
		},
		cilckArea(){ //选择地址
			uni.navigateTo({
				url: '../siteAdderss/index?latitude=' + this.latitude + '&longitude=' + this.longitude
			})
		}
	},
}
</script>
<style lang='scss' scoped>
	.top_heigt{
		min-height: 360rpx;
	}
	.news_top{
		margin-top: 24rpx;
		background-color: #fff;
		width: 708rpx;
		border-radius: 8rpx;
		box-shadow: 0rpx 4rpx 12rpx 0rpx rgba(0,0,0,0.04);
		position: relative;
		.news_right-text{
			height: 56rpx;
			width: 124rpx;
			background-color: #0482FF;
			text-align: center;
			position: absolute;
			right: 0;
			top: -14rpx;
			font-size: 24rpx;
			font-weight: 400;
			color: #FFFFFF;
			line-height: 56rpx;
			border-radius: 4rpx;
		}
	}
	.news_top-test{
		margin-bottom: 28rpx;
		width: 646rpx;
		height: 72rpx;
		margin-top: 16rpx;
		margin-left: 28rpx;
		font-size: 24rpx;
		font-family: PingFangSC, PingFangSC-Regular;
		font-weight: 400;
		text-align: justify;
		color: #999999;
		line-height: 36rpx;
	}
	.news_qes{
		height: 256rpx;
	}
	.qes_type{
		min-height: 100rpx;
	}
	.news_qesType{
		min-height: 200rpx;
	}
	.news_bottom{
		height: 272rpx
	}
	.UploadFile{
		margin-left: 12rpx;
	}
	.sing_icon{
		width: 32rpx;
		height: 32rpx;
		display: inline-block;
		float: right;
		margin-right: 28rpx;
	}
	.news_textarea{
		margin-top: 8rpx;
		margin-left: 44rpx;
		line-height: 36rpx;
		font-size: 28rpx;
		height: 120rpx;
		overflow: auto;
		overflow-x: hidden;
		textarea{
			width: 630rpx;
			height: 120rpx;
		}
	}
	.news_textarea-text{
		float: right;
		margin-right: 24rpx;
		opacity: 1;
		font-size: 24rpx;
		font-family: PingFangSC, PingFangSC-Regular;
		font-weight: 400;
		text-align: right;
		color: #999999;
		line-height: 44rx;
	}
	/deep/.placeholder_class{
		font-size: 28rpx;
		font-family: PingFangSC, PingFangSC-Regular;
		color: #bfbfbf;
		font-weight: 400;
	}
	.news_type-icon{
		float: right;
		margin-right: 28rpx;
		margin-top: 8rpx;
	}
	.area_icon{
		height: 32rpx;
		width: 32rpx;
		float: right;
		margin-right: 28rpx;
	}
	.news_btn-box{
		position: relative;
		bottom: 24rpx;
		margin-top: 24rpx;
		button{
			margin-top: 24rpx;
			width: 704rpx;
			height: 88rpx;
			background: #0482ff;
			border-radius: 8rpx;
			font-size: 36rpx;
			font-family: PingFangSC, PingFangSC-Regular;
			font-weight: 400;
			text-align: center;
			color: #ffffff;
		}
	}
	.news_area-text{
		width: 630rpx;
		margin-left: 44rpx;
		margin-top: 8rpx;
		font-size: 28rpx;
		font-weight: 400;
		color: #666;
		text-align: left;
		line-height: 44rpx;
		margin-bottom: 28rpx;
	}
	.news_qes-text{
		color: #333;
		text-align: right;
		min-width: 480rpx;
		display: inline-block;
	}
	.news_around{
		margin-top: 24rpx;
		margin-left: 12rpx;
		image{
			margin-left: 16rpx;
			height: 144rpx;
			width: 144rpx;
		}
		.no-content{
			text-align: center;
			margin-top: 24px;
		}
	}
	.vioce-box-icon{
		margin-top: 12rpx;
		width: 100%;
		height: 210rpx;
		text-align: center;
	}
	.vioce-box-height{
		min-height: 40rpx;
		margin-bottom: 30rpx;
	}
	.vioce-box-height p{
		height: 40rpx;
		font-size: 36rpx;
		color:#FF7A00 ;
	}
	.vioce-box-icon image{
		width: 160rpx;
		height: 160rpx;
	}
	.textarea{
		line-height: 36rpx;
		height: 180rpx;
		width: 90vw;
	}
	.vioce-box-text{
		margin-top: 76rpx;
		height: 216rpx;
		width: 694rpx;
		margin-left: 28rpx;
		color: #333333;
		font-size: 32rpx;
		line-height: 32rpx;
	}
	.vioce-box-text-left{
		float: left;
		min-width:30vw;
		font-size: 32rpx;
		color: #999;
		margin-left: 60rpx;
		margin-top: 10rpx;
	}
	.vioce-box-text-right{
		float: left;
		min-width: 10vw;
		font-size: 32rpx;
		color: #333;
		margin-left: 70rpx;
		font-weight: 600;
		margin-top: 10rpx;
	}
	.submit-box{
		/* min-height: 640rpx; */
		margin-top: 24rpx;
		height: 100%;
		width: 702rpx;
		background-color: #FFF;
		padding: 28rpx;
		.sub-top-box{
			display: flex;
			.title{
				width: 252rpx;
				font-size: 36rpx;
				font-family: PingFangSC, PingFangSC-Medium;
				font-weight: 600;
				text-align: left;
				color: #333333;
				line-height: 56rpx;
			}
			button{
				margin-left: 250rpx;
				height: 64rpx;
				width: 144rpx;
				background-color: #0482FF;
				color: #FFF;
				font-size: 24rpx;
			}
		}
		.sub-time{
			font-size: 24rpx;
			color: #999999;
			line-height: 34rpx;
			margin-top: 4rpx;
		}
		.sub-type{
			display: inline;
			margin-top: 8rpx;
			width: 140rpx;
			font-size: 28rpx;
			text-align: left;
			color: #333333;
			line-height: 44rpx;
			span{
				color: #666666;
			}
		}
		.sub-detail{
			display: inline;
			margin-top: 8rpx;
			width: 140rpx;
			font-size: 28rpx;
			text-align: left;
			color: #333333;
			line-height: 44rpx;
			span{
				color: #666666;
				width: 500rpx;
			}
		}
		.icon-area{
			margin-top: 20rpx;
			font-size: 28rpx;
			color: #999999;
		}
		.sub-img{
			margin-top: 24rpx;
			image{
				height: 144rpx;
				width: 144rpx;
				margin-right: 16rpx;
			}
		}
		.sub-btn{
			/* display: flex; */
			margin-top: 48rpx;
			button{
				height: 88rpx;
				width: 646rpx;
				border-radius: 10rpx;
			}
			.confirm{
				color: #0482FF;
				background: #ffffff;
				border: 2rpx solid #0482ff;
				margin-right: 26rpx;
			}
/* 			.share{
				background: #0482ff;
				color: #FFF;
			} */
		}
	}
	.submit-around-box{
		margin-top: 24rpx;
		height: 650rpx;
		width: 702rpx;
		background-color: #FFF;
		padding: 28rpx;
		.around-top-flex{
			display: flex;
			.title{
				width: 112rpx;
				font-size: 28rpx;
				font-family: PingFangSC, PingFangSC-Medium;
				font-weight: 600;
				text-align: left;
				color: #333333;
				line-height: 44rpx;
			}
			.more{
				color: #999999;
				font-size: 40rpx;
				margin-left: 494rpx;
			}
		}
	}
	.around-content-box{
		display: flex;
		margin-top: 30rpx;
		image{
			height: 144rpx;
			width: 144rpx;
		}
		.content-center{
			margin-left: 16rpx;
			.title{
				font-size: 28rpx;
				text-align: left;
				color: #333333;
				line-height: 44rpx;
			}
			.content{
				width: 368rpx;
				font-size: 24rpx;
				text-align: left;
				color: #666666;
				line-height: 34rpx;
			}
		}
		.content-right{
			margin-left: 24rpx;
			text-align: center;
			width: 100rpx;
			.icon-zan{
				color: #FF5167;
				font-size: 48rpx;
			}
			.num{
				font-size: 24rpx;
				color: #666666;
				line-height: 34rpx;
			}
			.text{
				margin-top: 2rpx;
				font-size: 24rpx;
				color: #666666;
				line-height: 34rpx;
			}
		}
	}
	.img{
		position: relative;
		margin-top: 24rpx;
		display: inline;
		.img-box{
			margin-right: 24rpx;
			height: 144rpx;
			width: 144rpx;
			border-radius: 8rpx;
		}
		.video_icon{
			height: 48rpx;
			width: 48rpx;
			position: absolute;
			left: 48rpx;
			top: -60rpx;
		}
	}
</style>