// 如果没有通过拦截器配置域名的话，可以在这里写上完整的URL(加上域名部分)
// let hotSearchUrl = '/ebapi/store_api/hot_search';
// let indexUrl = '/ebapi/public_api/index';
// 此处第二个参数vm，就是我们在页面使用的this
import { mqwbUrl, gisUrl } from './config.js'
const install = (Vue, vm) => {
	//办事网点
	let getBrabchEdit = (params = {}) => vm.$u.get('/ps/event/branch/app/list', params);
	// 办事指南
	let getGuideList = (params = {}) => vm.$u.get('/ps/event/guide/app/list', params); //办事指南
	let getGuideDetail = (params = {}) => vm.$u.get('/ps/event/guide/detail', params); //详情
	//爆料	
	let getDisclose = (params = {}) => vm.$u.get(params); //分享查看信息
	let upThumb = (params = {}) => vm.$u.get(params); //点赞
	let getNearbyList = (params = {}) => vm.$u.get('/ps/disclose/nearby', params); //周边爆料
	let addDisclose = (data = {}) => vm.$u.post('/ps/disclose/single-disclose', data); //新增爆料
	let hisDiscloses = (params = {}) => vm.$u.get('/ps/disclose/his-discloses', params); //爆料历史记录
	let hisDiscloseDetail = (params = {}) => vm.$u.get('/ps/disclose/single-disclose', params); //爆料单条
	let hisHandleDiscloses = (params = {}) => vm.$u.get('/ps/disclose/his-handled-discloses', params); //爆料已处理
	let hisUnhandleDiscloses = (params = {}) => vm.$u.get('/ps/disclose/his-unhandle-discloses', params); //爆料处理中
	//处理经过
	let discloseProgress = (params) => vm.$u.get('/ps/disclose/disclose-progress/' + params);
	//积分
	let creditRules = (params = {}) => vm.$u.get('/ps/credit/credit-rules', params); //积分规则
	let creditRecords = (params = {}) => vm.$u.get('/ps/credit/current-records', params); //积分明细
	let personCredit = (params = {}) => vm.$u.get('/ps/credit/person-credit', params); // 用户当前积分
	let creditAwards = (params = {}) => vm.$u.get('/ps/credit/awards', params); //兑换奖品
	let displayClear = (params = {}) => vm.$u.get('/ps/credit/display-clear', params); // 清空规则
	let awardExchange = (data = {}) => vm.$u.post('/ps/credit/award-exchange', data, {
		'content-type': 'application/x-www-form-urlencoded'
	})
	//城管动态
	let newsList = (params = {}) => vm.$u.get('/ps/news/app-list', params); //城管动态列表；
	let singleNews = (params = {}) => vm.$u.get('/ps/news/single-news', params); //城管动态单个详情
	//政策法规
	let policyedList = (params = {}) => vm.$u.get('/ps/policy/category', params); // 分类列表
	let policyList = (params = {}) => vm.$u.get('/ps/policy/category/list', params); // 分页列表
	let policyDetail = (params = {}) => vm.$u.get('/ps/policy/detail', params); //详情
	// 消息通知
	let messageList = (params = {}) => vm.$u.get('/ps/message/app/list', params); // 分页查询
	let messageDetail = (params = {}) => vm.$u.get('/ps/message/detail', params); //详情
	//每日一题
	let getDailySubject = (params = {}) => vm.$u.get('/ps/subject/daily-subject', params); //得到今日题目
	let submitResult = (data = {}) => vm.$u.post('/ps/subject/daily-subject-result', data); //提交结果 
	let getDailyHistory = (params = {}) => vm.$u.get('/ps/subject/daily-history', params); //历史答题
	let getSubjectHistory = (params = {}) => vm.$u.get('/ps/subject/history-single', params); //历史某日答题详情
	// 区域列表
	let areaList = (params = {}) => vm.$u.get('/ps/common/area/list', params); // 区域列表
	// 天天骑行
	let getBikeList = (params = {}) => vm.$u.get('/ps/bike/store/nearby', params); //获得附件站点
	let addBikeStore = (data = {}) => vm.$u.post('/ps/bike/store/edit', data); //新增收藏取消收藏
	let delBikeStore = (data = {}) => vm.$u.post('/ps/bike/store/dels', data); //批量删除
	let getBikeStore = (params = {}) => vm.$u.get('/ps/bike/store/list', params); //分页列表我的收藏
	let getBikeDetail = (params = {}) => vm.$u.get('/ps/bike/store/detail', params); //详情
	// 天天公厕
	let getToiletList = (params = {}) => vm.$u.get('/ps/toilet/store/nearby', params); //获得附件站点
	let addToiletStore = (data = {}) => vm.$u.post('/ps/toilet/store/edit', data); //新增收藏取消收藏
	let delToiletStore = (data = {}) => vm.$u.post('/ps/toilet/store/dels', data); //批量删除
	let getToiletStore = (params = {}) => vm.$u.get('/ps/toilet/store/list', params); //分页列表我的收藏
	let getToiletDetail = (params = {}) => vm.$u.get('/ps/toilet/store/detail', params); //详情
	// 便民驿站
	let getHandytList = (params = {}) => vm.$u.get('/ps/handy/store/nearby', params); //获得附件站点
	let addHandyStore = (data = {}) => vm.$u.post('/ps/handy/store/edit', data); //新增收藏取消收藏
	let delHandyStore = (data = {}) => vm.$u.post('/ps/handy/store/dels', data); //批量删除
	let getHandyStore = (params = {}) => vm.$u.get('/ps/handy/store/list', params); //分页列表我的收藏
	let getHandyDetail = (params = {}) => vm.$u.get('/ps/handy/store/detail', params); //详情
	// let getTypeList = (params = {}) => vm.$u.get('/ps/handy/type', params); //获取所有类型
	let getTypeList = (params = {}) => vm.$u.get('/ps/handyProgramInfo/list', params); //获取所有类型
	// 建议咨询
	let checkAuthentication = (params = {}) => vm.$u.get('/ps/common/sys/currentUserDetail', params); //检查是否认证
	let toAuthentication = (data = {}) => vm.$u.post('/ps/common/sys/psPersonAttestation', data); // 认证接口
	let consultSubmit = (data = {}) => vm.$u.post('/ps/consult/submit', data); // 建议咨询提交
	let consultList = (params = {}) => vm.$u.get('/ps/consult/list', params); // 咨询记录
	let consultDetail = (params = {}) => vm.$u.get('/ps/consult/find/' + params); // 咨询详情
	// 积分排行榜
	let pointsRanking = (params = {}) => vm.$u.get('/ps/credit/credit-ranks-new', params); 
	// 调查问卷
	let questionList = (params = {}) => vm.$u.get('/ps/psSurveyTemplate/app/page', params);
	let questionDetail = (params = {}) => vm.$u.get('/ps/psSurveyTemplate/detail/' + params);
	let surveyAnswer = (data = {}) => vm.$u.post('/ps/api/psSurveyAnswer/v1', data);
	
	// 优秀案卷
	let getQuestionType = (params = {}) => vm.$u.get('/ps/common/sys/question-type', params); //问题处理类型
	let getBetterList = (params = {}) => vm.$u.get('/ps/disclose/discloses', params); //爆料案卷分页
	let getBetterDetail = (params = {}) => vm.$u.get('/ps/disclose/disclose', params); //案卷详情
	let upEvalution = (data = {}) => vm.$u.post('/ps/disclose/evaluation', data, {
		'content-type': 'application/x-www-form-urlencoded'
	}); //市民评价
	// 商户认证
	let getUserPhoneNumber = (data = {}) => vm.$u.post(mqwbUrl + '/mqwb/api/applet/getUserPhoneNumber', data); // 获取用户手机号(通用)
	let queryDataByCoordinate = (data = {}) => vm.$u.post(gisUrl + '/gisApi/jzApi/queryDataByCoordinate', data); // 获取地图点位信息(通用)
	let getStoreBaseList = (data = {}) => vm.$u.post(mqwbUrl + '/mqwb/api/storeBase/findListByPage', data); // 商铺信息管理列表
	let findStoreBaseById = (params = {}) => vm.$u.get(mqwbUrl + '/mqwb/api/storeBase/findById', params); // 商铺详情
	let findStoreBaseByIdv2 = (params = {}) => vm.$u.get(mqwbUrl + '/mqwb/api/storeBase/findById/v2', params); // 商铺详情(脱敏)
	let claimStoreBaseById = (data = {}) => vm.$u.post(mqwbUrl + '/mqwb/api/storeBase/claim', data); // 商铺认领
	let checkStoreBaseByTel = (data = {}) => vm.$u.post(mqwbUrl + '/mqwb/api/storeBase/tel/check', data); // 校验手机号（不一致返回false）
	let queryEnumByEnumType = (params = {}) => vm.$u.get(mqwbUrl + '/mqwb/api/common/queryEnumByEnumType', params); // 根据枚举类型查询枚举项
	let createStoreBase = (data = {}) => vm.$u.post(mqwbUrl + '/mqwb/api/storeBase/create', data); // 创建商铺
	let updateStoreBase = (data = {}) => vm.$u.post(mqwbUrl + '/mqwb/api/storeBase/update', data); // 变更商铺
	let findByUniformCreditCode = (params = {}) => vm.$u.get(mqwbUrl + '/mqwb/api/storeBase/findByUniformCreditCode', params); // 校验信用代码
	let getStoreBaseAuthCode = (params = {}) => vm.$u.get(mqwbUrl + '/mqwb/api/storeBase/auth/code', params); // 请求验证码
	let findStoreCaseListByPage = (data = {}) => vm.$u.post(mqwbUrl + '/mqwb/api/storeCase/findListByPage', data); // 分页查询商户案件表列表
	let findStoreCaseById = (params = {}) => vm.$u.get(mqwbUrl + '/mqwb/api/storeCase/findById', params); // 案件详情
	let findStoreCaseOpLogByListByPage = (data = {}) => vm.$u.post(mqwbUrl + '/mqwb/api/storeCaseOpLog/findListByPage', data); // 案件操作日志
	let handleStoreCase = (data = {}) => vm.$u.post(mqwbUrl + '/mqwb/api/storeCase/handle', data); // 商户处置
	let statsByStoreId = (params = {}) => vm.$u.get(mqwbUrl + '/mqwb/api/storeCase/statsByStoreId', params); // 单个商户下案件统计
	vm.$u.api = {
		delHandyStore,
		delToiletStore,
		delBikeStore,
		getDisclose,
		upThumb,
		getNearbyList,
		upEvalution,
		getBetterDetail,
		getBetterList,
		checkAuthentication,
		toAuthentication,
		consultSubmit,
		consultList,
		consultDetail,
		pointsRanking,
		questionList,
		questionDetail,
		surveyAnswer,
		getQuestionType,
		getTypeList,
		getHandytList,
		addHandyStore,
		getHandyStore,
		getHandyDetail,
		getToiletDetail,
		getBikeDetail,
		getToiletList,
		addToiletStore,
		getToiletStore,
		getBikeStore,
		addBikeStore,
		getBikeList,
		getGuideDetail,
		messageDetail,
		getSubjectHistory,
		getGuideList,
		areaList,
		getDailyHistory,
		submitResult,
		policyDetail,
		getDailySubject,
		messageList,
		policyedList,
		policyList,
		singleNews,
		newsList,
		awardExchange,
		displayClear,
		creditAwards,
		hisDiscloseDetail,
		getBrabchEdit,
		addDisclose,
		hisDiscloses,
		hisHandleDiscloses,
		hisUnhandleDiscloses,
		creditRules,
		creditRecords,
		personCredit,
		discloseProgress,
		getStoreBaseList,
		findStoreBaseById,
		findStoreBaseByIdv2,
		claimStoreBaseById,
		checkStoreBaseByTel,
		queryEnumByEnumType,
		findByUniformCreditCode,
		getStoreBaseAuthCode,
		findStoreCaseListByPage,
		findStoreCaseById,
		findStoreCaseOpLogByListByPage,
		handleStoreCase,
		statsByStoreId,
		getUserPhoneNumber,
		createStoreBase,
		updateStoreBase,
		queryDataByCoordinate
	};
}

export default {
	install
}
