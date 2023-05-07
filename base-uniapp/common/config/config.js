// 环境配置相关
import develop from '../env/develop.env.js'
import trial from '../env/trial.env.js'
import release from '../env/release.env.js'
// 根据不同环境设置相应的服务ip
const envConfigs = {
	develop,
	trial,
	release
}
const accountInfo = wx.getAccountInfoSync()
// env类型
const wechatEnv = accountInfo.miniProgram.envVersion
console.log(wechatEnv, 'env')
if (!wechatEnv) {
	console.error('获取运行环境失败!')
}
const ENV_CONFIG = envConfigs[wechatEnv]

export const baseUrl = ENV_CONFIG.baseUrl
export const fileUrl = ENV_CONFIG.fileUrl
export const mqwbUrl = ENV_CONFIG.mqwbUrl // 门前五包
export const mqwbFileUrl = ENV_CONFIG.mqwbFileUrl // 门前五包资源
export const gisUrl = ENV_CONFIG.gisUrl // gis服务