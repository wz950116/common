## 相关模块
``` bash
import CryptoJS from 'crypto-js'
import MD5 from 'crypto-js/md5'
import gcoord from 'gcoord'
import Bowser from 'bowser'
import { Decimal } from 'decimal.js'
import NP from 'number-precision'
import CreateAPI from 'vue-create-api';
import ClipboardJS from 'clipboard';
import VuexPersistence from 'vuex-persist'
import lrz from 'lrz'
import { debounce, throttle } from 'lodash-es'
import pinyin from 'js-pinyin'
```
## 手机号脱敏
``` bash
export function phoneDesensitization(phone) {
  if (phone.length === 11) {
    return phone.replace(/(\d{3})\d*(\d{4})/, "$1****$2")
  }
  return phone
}
```
## 把汉字转化为拼音字母
``` bash
pinyin.setOptions({ checkPolyphone: false, charCase: 1 }) // charCase设为0则输出大驼峰
pinyin.getFullChars('管理员') // guanliyuan
pinyin.getCamelChars('管理员') // gly
pinyin.getCamelChars('管理员').charAt(0) // g
```
## H5唤起各种地图APP
``` bash
const longitude = ''
const latitude = ''
if (val === '高德地图') {
  location.href = `https://uri.amap.com/marker?position=${longitude},${latitude}&callnative=1&coordinate=wgs84&src=mypage`
} else if (val === '百度地图') {
  location.href = `http://api.map.baidu.com/marker?location=${latitude},${longitude}&output=html&src=webapp.baidu.openAPIdemo&coord_type=wgs84`
} else if (val === '腾讯地图') {
  location.href = `https://apis.map.qq.com/uri/v1/marker?marker=coord:${latitude},${longitude};coordtype:1`
}
```
## vuex + storage 存储持久化
``` bash
const vuexLocal = new VuexPersistence({
  key: 'services',
  storage: window.localStorage,
  // 持久化部分模块
  modules: ['user']
})
Vue.use(Vuex)

const store = new Vuex.Store({
  modules: {
    user
  },
  getters,
  plugins: [vuexLocal.plugin]
})

export default store
```
## 微信小程序
* 语音转换功能
``` bash
function wechatSign(jsApiList = ['getLocation']) {
  const hostUrl = /(Android)/i.test(navigator.userAgent) ? location.href.split('#')[0] : window.entryUrl;
  var nonceStr = (function() {
    return Math.random().toString(36).substr(2, 16);
  })();
  var timestamp = (function() {
    return parseInt(new Date().getTime() / 1000) + '';
  })();
  return new Promise((resolve) => {
    getWechatSign({ hostUrl, nonceStr, timestamp }).then(({ success, data, message }) => {
      if (success) {
        wx.config({
          debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
          appId: process.env.VUE_APP_APPID, // 必填，公众号的唯一标识
          timestamp, // 必填，生成签名的时间戳
          nonceStr, // 必填，生成签名的随机串
          signature: data, // 必填，签名
          jsApiList: jsApiList // 必填，需要使用的JS接口列表
        });
      }
      resolve();
    });
  });
}
export async function getWx() {
  await wechatSign([
    'translateVoice',
    'startRecord',
    'stopRecord',
    'onVoiceRecordEnd',
    'playVoice',
    'onVoicePlayEnd',
    'stopVoice',
    'uploadVoice'
  ]);
  return new Promise((resolve, reject) => {
    console.log(wx);
    wx.ready(() => {
      resolve();
    });
  })
}
```
* 录音功能
``` bash
const plugin = requirePlugin("WechatSI")
let manager = plugin.getRecordRecognitionManager()
// 手指按下事件
touchStart: function() {
  this.voiceTextFlag = false
  manager.start({
    duration: 60000,
    lang: "zh_CN"
  })
  uni.showLoading({
    title: '正在语音输入'
  })
}
// 手指松开事件
touchEnd: function() {
  this.voiceTextFlag = true
  uni.hideLoading()
  uni.showToast({
    title: '语音输入完成',
    duration: 500
  })
  manager.stop()
}
// 插件初始化
initRecord: function() {
  manager.onStart = function(res) {
    this.voiceText = "onStart:" + res.msg + "正在录音"
  }
  // 有新的识别内容返回，则会调用此事件  
  manager.onRecognize = (res) => {
    this.voiceText = this.voiceText + res.result.replace('。', '')
  }
  // 识别结束事件  
  manager.onStop = (res) => {
    this.voiceText = this.voiceText + res.result.replace('。', '')
  }
  // 识别错误事件  
  manager.onError = (res) => {
    // this.voiceState = this.voiceState + res.msg
    // this.length = this.voiceState.length
  }
}
```
## 引入第三方小型组件或者全局注册公共组件
``` bash
import Reality from 'xxxx';
Vue.use(CreateAPI);
Vue.createAPI(Reality, true);
# 调用该组件内部AAA方法
this.$createReality().show()
```
## 解决加减乘除精度丢失问题
``` bash
export function numberFixed(a, b, symbol = '+') {
  let result = ''
  switch (symbol) {
    case '+':
      result = new Decimal(a).add(new Decimal(b))
      break
    case '-':
      result = new Decimal(a).sub(new Decimal(b))
      break
    case '*':
      result = new Decimal(a).mul(new Decimal(b))
      break
    case '/':
      result = new Decimal(a).div(new Decimal(b))
      break
  }
  return result
}
export function numberFixed(a, b, symbol = '+') {
  let result = ''
  switch (symbol) {
    case '+':
      result = NP.add(a, b)
      break
    case '-':
      result = NP.sub(a, b)
      break
    case '*':
      result = NP.multi(a, b)
      break
    case '/':
      result = NP.divide(a, b)
      break
  }
  return result
}
```
## 复制原生
``` bash
export function initClipboardJS() {
  // navigator.clipboard.writeText() 用于将文本内容写入剪贴板 异步
  // navigator.clipboard.write() 用于将文本数据/二进制数据写入剪贴板 异步
  // document.execCommand('copy')，用于将已选中的文本内容写入剪贴板 同步
  // 点击复制
  document.body.addEventListener('click', async(e) => {
    const text = document.getElementById('input').value
    await navigator.clipboard.writeText(text)
  })
}
```
## 复制插件
``` bash
export function initClipboardJS() {
  const clipboard = new ClipboardJS('#description')
  clipboard.on('success', function() {
    this.$message.success('复制成功')
    e.clearSelection()
  })
}
```
## 时间相关
* 格式化
``` bash
export function formatTime(date, pattern) {
  // 判断是否传时间，若没传则默认为当前时间
  if (!date) {
    date = new Date()
  }
  // 判断是否为字符串，例如：2020-02-02需要转换成2020/02/02，因为前者是8点后者是0点整
  if (typeof date === 'string') {
    date = new Date(date.replace(/-/g, '/'))
  }
  // 判断是否为时间戳，例如1680687930477
  if (typeof date === 'number') {
    date = new Date(date)
  }
  // 判断是否为不合法时间对象，例如：new Date('20200505')
  if (date.toString() === 'Invalid Date') {
    return ''
  }
  // 判断是否传格式化要求
  const _pattern = pattern || 'yyyy-MM-dd hh:mm:ss'
  // 匹配项
  const timeObj = {
    yyyy: date.getFullYear() + '',
    MM: `0${date.getMonth() + 1}`.slice(-2),
    M: date.getMonth() + 1,
    dd: `0${date.getDate()}`.slice(-2),
    d: date.getDate(),
    hh: `0${date.getHours()}`.slice(-2),
    h: date.getHours(),
    mm: `0${date.getMinutes()}`.slice(-2),
    m: date.getMinutes(),
    ss: `0${date.getSeconds()}`.slice(-2),
    s: date.getSeconds()
  }
  const timeStr = _pattern.replace(/(yyyy|MM|M|dd|d|hh|h|mm|m|ss|s)/g, function(match, p) {
    const value = timeObj[p]
    return value
  })
  return timeStr
}
```
* 获取每个月第一天0时时间戳
``` bash
export function getFirstDay() {
  // 获取当天0点时间戳
  const todayStart = +new Date().setHours(0, 0, 0, 0)
  return new Date(todayStart).setDate(1)
}
```
* 距离指定日期剩余时间
``` bash
export function remainTime(endTime) {
  if (endTime === '' || endTime === undefined) return ''
  // 现在时间
  const now = new Date()
  // 截止时间
  const until = new Date(endTime)
  // 计算时会发生隐式转换，调用valueOf()方法，转化成时间戳的形式
  const days = (until - now) / 1000 / 3600 / 24
  // 下面都是简单的数学计算
  const day = Math.floor(days)
  const hours = (days - day) * 24
  const hour = Math.floor(hours)
  const minutes = (hours - hour) * 60
  const minute = Math.floor(minutes)
  const seconds = (minutes - minute) * 60
  const second = Math.floor(seconds)
  const back = day + '天' + hour + '小时' + minute + '分钟' + second + '秒'
  return day < 0 ? '' : back
}
```
* 获取某个月的日历表
``` bash
export function initCalendar(year = new Date().getFullYear(), month = new Date().getMonth() + 1) {
  const calendars2 = [];
  const riliStyle2 = [];
  const cale = [], riliStyle = [];
  const firstDay = new Date(`${year}-${month}`);
  for (let i = 0; i < firstDay.getDay(); i++) {
    cale.unshift({ day: new Date(firstDay.getTime() - 86400000 * (i + 1)).getDate() });
    riliStyle.unshift('dis');
  }
  let n = firstDay.getTime();
  let nextMM = '';
  if (this.month === 12) {
    nextMM = new Date(`${year + 1}/${1}`).getTime();
  } else {
    nextMM = new Date(`${year}/${month + 1}`).getTime();
  }

  const newDate = new Date();
  while (n < nextMM) {
    const currentData = new Date(n);
    const _f = currentData > newDate;
    const getDate = currentData.getDate();
    const getDay = currentData.getDay();
    let riliStyleItem = '';
    let isWork = 0;

    if (getDay === 0 || getDay === 6) {
      isWork = 0;
    } else {
      isWork = 1;
    }

    if (isWork === 0) {
      riliStyleItem = _f ? 'holiday' : 'holiday-no';
    }

    if (isWork === 1) {
      riliStyleItem = _f ? 'nomal' : 'nomal-no';
    }

    riliStyle.push(riliStyleItem);
    cale.push({ day: getDate, isWork: isWork });
    n = n + 86400000;
  }
  for (let i = new Date(n).getDay(); i < 7; i++) {
    cale.push({ day: new Date(n).getDate() });
    n = n + 86400000;
    riliStyle.push('dis');
  }
  for (let i = 0; i < cale.length; i += 7) {
    const arr = [], arr0 = [];
    for (let j = 0; j < 7; j++) {
      arr.push(cale[i + j]);
      arr0.push(riliStyle[i + j]);
    }
    calendars2.push(arr);
    riliStyle2.push(arr0);
  }
  console.log(calendars2, riliStyle2, 0);
  this.$forceUpdate();
}
```
## 图片转换成file对象
* url转换成blob再转换成file对象
``` bash
export function getImageFileFromUrl(url, imageName) {
  return new Promise((resolve, reject) => {
    let blob = null
    const xhr = new XMLHttpRequest()
    xhr.open('GET', url)
    xhr.setRequestHeader('Accept', 'image/*')
    xhr.responseType = 'blob'
    // 加载时处理
    xhr.onload = () => {
      // 获取返回结果
      blob = xhr.response
      const imgFile = new File([blob], imageName, { type: 'image/*' })
      // 返回结果
      resolve(imgFile)
    }
    xhr.onerror = (e) => {
      reject(e)
    }
    // 发送
    xhr.send()
  })
}
```
* 利用canvas把url转换成dataURL再转换成file对象
``` bash
export function getImageFileFromUrl(url, filename) {
  // 创建Image实例比创建img标签更优
  const Img = new Image()
  let dataURL = ''
  Img.src = url + '?v=' + Math.random() // 处理缓存,fix缓存bug,有缓存，浏览器会报错;
  Img.setAttribute('crossOrigin', 'Anonymous') // 解决控制台跨域报错的问题
  Img.onload = () => {
    const canvas = document.createElement('canvas')
    const width = Img.width
    const height = Img.height
    canvas.width = width
    canvas.height = height
    canvas.getContext('2d').drawImage(Img, 0, 0, width, height)
    dataURL = canvas.toDataURL('image/jpeg') // 转换图片为dataURL

    const arr = dataURL.split(',')
    const mime = arr[0].match(/:(.*?);/)[1]
    const bstr = atob(arr[1])
    let n = bstr.length
    const u8arr = new Uint8Array(n)
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n)
    }
    const file = new File([u8arr], filename, { type: mime })
    this.fileList.push(file)
    console.log(this.fileList, 2233)
  }
}
```
* base64转换成file对象
``` bash
export function getImageFileFromBase64(url) {
  lrz(url, {
    width: 300
    // quality: 0.8 // 自定义使用压缩方式，ios拍照图片可能会旋转90°，因此不建议用lrz进行压缩
  }).then((file) => {
    console.log(file.file)
  }).catch(error => {
    console.log(error, 'transform fail!')
  })
}
```
* 图片压缩
``` bash
export function getCompressorImage(file) {
  new Compressor(file, {
    quality: 0.6,
    success: (result) => {
      console.log(result)
    },
    error(err) {
      console.log(err.message)
    }
  })
}
```
## 导出excel
* 方法一
``` bash
export function downloadFile(res) {
  // responseType: blob
  const downloadLink = window.document.createElement('a')
  const fileName || (Math.random().toString(16).split('.')[1] + '.xlsx')
  const fileUrl = res.data && window.URL.createObjectURL(res.data)
  downloadLink.href = fileUrl
  downloadLink.download = fileName
  document.body.appendChild(downloadLink)
  downloadLink.click()
  document.body.removeChild(downloadLink)
  window.URL.revokeObjectURL(fileUrl)
}
```
* 方法二
``` bash
export function downloadFileByArraybuffer(res, fileName) {
  // responseType: arraybuffer 转换成blob导出
  const blob = new Blob([res], {
    type: 'application/vnd.ms-excel'
  })
  const a = document.createElement('a')
  const reg = /filename=(.*.xls)/
  const _fileName = res.headers ? decodeURIComponent(reg.exec(res.headers['content-disposition'])[1]) : '新建文件'
  // 正则匹配获取文件名
  a.href = window.URL.createObjectURL(blob)
  a.download = fileName || _fileName
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  window.URL.revokeObjectURL(a.href)
}
```
* 方法三
``` bash
export function _downloadFile(resBlob, fileName) {
  const reader = new FileReader()
  // 转换为base64，可以直接放入a标签href
  reader.readAsDataURL(resBlob)
  reader.onload = e => {
    // 转换完成，创建一个a标签用于下载
    const a = document.createElement('a')
    a.download = `${fileName}.xlsx`
    a.href = e.target.result
    document.body.append(a)
    a.click()
    document.body.removeChild(a)
  }
}
```
* 方法四
``` bash
export function downloadByUrl(url, name) {
  try {
    const elt = document.createElement("a");
    elt.setAttribute("href", url);
    elt.setAttribute("download", name);
    elt.setAttribute("target", '_blank');
    elt.style.display = "none";
    document.body.appendChild(elt);
    elt.click();
    document.body.removeChild(elt);
  } catch (error) {
    console.log(error);
  }
}
```
## 深拷贝
``` bash
export function deepCopy(obj) {
  var result = Array.isArray(obj) ? [] : {}
  for (var key in obj) {
    if (obj.hasOwnProperty(key)) {
      if (typeof obj[key] === 'object' && obj[key] !== null) {
        result[key] = deepCopy(obj[key])
      } else {
        result[key] = obj[key]
      }
    }
  }
  return result
}
```
## 树结构转换成一维数组
``` bash
export function treeToArray(tree) {
  return tree.reduce((res, item) => {
    const { children, ...i } = item
    return res.concat(i, children && children.length ? treeToArray(children) : [])
  }, [])
}
```
## 根据ID获取该节点的所有父节点的数组对象
``` bash
export function getParentId(list, value, children = 'children', key = 'id', extraKey = 'userId') {
  for (const i in list) {
    if (list[i][key] === value || list[i][extraKey] === value) {
      return [list[i]]
    }
    if (list[i][children] && list[i][children].length) {
      const node = getParentId(list[i][children], value, children, key, extraKey)
      if (node !== undefined) {
        return node.concat(list[i])
      }
    }
  }
}
```
## 根据ID获取该节点的对象
``` bash
export function getId(list, value, children = 'children', key = 'id', extraKey = 'userId') {
  for (const i in list) {
    if (list[i][key] === value || list[i][extraKey] === value) {
      return list[i]
    }
    if (list[i][children]) {
      const node = getId(list[i][children], value, children, key, extraKey)
      if (node !== undefined) {
        return node
      }
    }
  }
}
```
## 精确到指定小数点 解决了toFixed不精确的js BUG
``` bash
export function toFixed(num, iCount) {
  // iCount 保留几位小数
  var srcValue = num;
  var zs = true;

  // 判断是否小数长度不大于iCount
  var floatValue = srcValue.toString().split(".");
  if (floatValue[1].length <= iCount) {
    return Number(srcValue).toFixed(iCount);
  }

  // 判断是否是负数
  if (srcValue < 0) {
    srcValue = Math.abs(srcValue);
    zs = false;
  }
  var iB = Math.pow(10, iCount);

  // 有时乘100结果也不精确
  var value1 = srcValue * iB;
  var anumber = new Array();
  var anumber1 = new Array();
  var fvalue = value1;
  var value2 = value1.toString();
  var idot = value2.indexOf(".");

  // 如果是小数
  if (idot != -1) {
    anumber = srcValue.toString().split(".");
    // 如果是科学计数法结果
    if (anumber[1].indexOf("e") != -1) {
      return Math.round(value1) / iB;
    }
    anumber1 = value2.split(".");
    if (anumber[1].length <= iCount) {
      return parseFloat(num, 10);
    }
    var fvalue3 = parseInt(anumber[1].substring(iCount, iCount + 1), 10);
    if (fvalue3 >= 5) {
      fvalue = parseInt(anumber1[0], 10) + 1;
    }
    else {
      // 对于传入的形如111.834999999998 的处理（传入的计算结果就是错误的，应为111.835）
      if (fvalue3 == 4 && anumber[1].length > 10 && parseInt(anumber[1].substring(iCount + 1, iCount + 2), 10) == 9) {
        fvalue = parseInt(anumber1[0], 10) + 1;
      }
      else {
        fvalue = parseInt(anumber1[0], 10);
      }
    }
  }
  
  // 如果是负数就用0减四舍五入的绝对值
  if (zs) {
    return fvalue / iB;
  }
  else {
    return 0 - fvalue / iB;
  }
}
```
## 数字转汉字
``` bash
export function toChinesNum(num) {
  const changeNum = ['零', '一', '二', '三', '四', '五', '六', '七', '八', '九']
  const unit = ['', '十', '百', '千', '万']
  num = parseInt(num)
  const getWan = (temp) => {
    const strArr = temp.toString().split('').reverse()
    let newNum = ''
    const newArr = []
    strArr.forEach((item, index) => {
      newArr.unshift(item === '0' ? changeNum[item] : changeNum[item] + unit[index])
    })
    const numArr = []
    newArr.forEach((m, n) => {
      if (m !== '零') numArr.push(n)
    })
    if (newArr.length > 1) {
      newArr.forEach((m, n) => {
        if (newArr[newArr.length - 1] === '零') {
          if (n <= numArr[numArr.length - 1]) {
            newNum += m
          }
        } else {
          newNum += m
        }
      })
    } else {
      newNum = newArr[0]
    }

    return newNum
  }
  const overWan = Math.floor(num / 10000)
  let noWan = num % 10000
  if (noWan.toString().length < 4) {
    noWan = '0' + noWan
  }
  return overWan ? getWan(overWan) + '万' + getWan(noWan) : getWan(num)
}
```
## 坐标转换（WGS84：天地图、 GCJ02：高德、 BD09：百度）
``` bash
export function transformPoint(target = [116.403988, 39.914266], type = 'WGS84', targetType = 'GCJ02') {
  return gcoord.transform(target, gcoord[type], gcoord[targetType]) // 或者自己通过算法计算，详情见@/utils/transformPoint.js
}
```
## 防抖动(最后一次调用过后指定时间执行一次)
``` bash
export function debounce(func, delay) {
  var timer = null
  return function () {
    var context = this
    var args = arguments
    clearTimeout(timer)
    timer = setTimeout(function() {
      func.apply(context, args)
    }, delay)
  }
}
```
## 节流(指定时间内只调用只执行一次)
``` bash
export function throttle(func, delay) {
  // 示例 window.addEventListener('scroll', throttle(func, 1000))
  var timer = null
  return function (...args) {
    var context = this
    var args = arguments
    if (!timer) {
      timer = setTimeout(function () {
        func.call(context, args)
        timer = null
      }, delay)
    }
  }
}
```
## 加密
* Base64
``` bash
export const base64 = {
  en: (data) => CryptoJS.enc.Base64.stringify(CryptoJS.enc.Utf8.parse(data)),
  de: (data) => CryptoJS.enc.Base64.parse(data).toString(CryptoJS.enc.Utf8)
}
```
* MD5加密
``` bash
export function encryptMD5(password) {
  return MD5(password).toString()
}
```
* AES
``` bash
# Base64加密 需要约定好盐值keyStr
export function encrypt(word, keyStr) {
  keyStr = keyStr || 'abcdefgabcdefg12'
  var key = CryptoJS.enc.Utf8.parse(keyStr)
  var srcs = CryptoJS.enc.Utf8.parse(word)
  var encrypted = CryptoJS.AES.encrypt(srcs, key, { mode: CryptoJS.mode.ECB, padding: CryptoJS.pad.Pkcs7 })
  return encrypted.toString()
}
# 解密（Base64格式）
export function decrypt(word, keyStr) {
  keyStr = keyStr || 'abcdefgabcdefg12'
  var key = CryptoJS.enc.Utf8.parse(keyStr)
  var decrypt = CryptoJS.AES.decrypt(word, key, { mode: CryptoJS.mode.ECB, padding: CryptoJS.pad.Pkcs7 })
  return CryptoJS.enc.Utf8.stringify(decrypt).toString()
}
# 解密（HEX格式）
export function decrypt(word, keyStr) {
  keyStr = keyStr || 'abcdefgabcdefg12'
  var key = CryptoJS.enc.Utf8.parse(keyStr)
  var decrypt = CryptoJS.AES.decrypt(CryptoJS.enc.Base64.stringify(CryptoJS.enc.Hex.parse(word)), key, { mode: CryptoJS.mode.ECB, padding: CryptoJS.pad.Pkcs7 })
  return CryptoJS.enc.Utf8.stringify(decrypt).toString()
}
```
## 验证浏览器版本
``` bash
const browser = Bowser.getParser(window.navigator.userAgent)
export const isValidBrowser = browser.satisfies({
  windows: {
    'internet explorer': '>11',
    'Microsoft Edge': '>51'
  },
  macos: {
    safari: '>10.1'
  },
  firefox: '>53',
  opera: '>=56',
  chrome: '>51'
})
```
## 判断是否为JSON对象
``` bash
export function isJSON(val) {
  // 传入JSON字符串
  if (typeof val !== 'string') {
    return false
  }
  try {
    const obj = JSON.parse(val.replace(/\s*/g, ""))
    if (Object.prototype.toString.call(obj) === '[object Object]') {
      return true
    } else {
      return false
    }
  } catch (e) {
    return false
  }
}
```
## 判断设备
``` bash
export function equip() {
  if (navigator.userAgent.match(/(phone|pad|pod|iPhone|iPod|ios|iPad|Android|Mobile|BlackBerry|IEMobile|MQQBrowser|JUC|Fennec|wOSBrowser|BrowserNG|WebOS|Symbian|Windows Phone)/i)) {
    return '移动端'
  }
  return 'PC端'
}
```
## 判断对象是否一致
``` bash
export function isObjectValueEqual(a, b) {
  var aProps = Object.keys(a);
  var bProps = Object.keys(b);
  if (aProps.length != bProps.length) {
    return false;
  }
  for (var i = 0; i < aProps.length; i++) {
    var propName = aProps[i];
    if (Object.prototype.toString.call(a[propName]) === "[object Object]" && Object.prototype.toString.call(a[propName]) === "[object Object]") {
      if (!isObjectValueEqual(a[propName], b[propName])) {
        return false
      }
    } else if (a[propName] !== b[propName]) {
      return false;
    }
  }
  return true;
}
```
## 本地存储
``` bash
export const storage = {
  get(key) {
    try {
      return JSON.parse(sessionStorage.getItem(key))
    } catch {
      return sessionStorage.getItem(key)
    }
  }
  set(key, value) {
    if (Object.prototype.toString.call(value) === '[object Object]') {
      localStorage.setItem(key, JSON.stringify(value))
    } else {
      localStorage.setItem(key, value)
    }
  },
  remove(key) {
    localStorage.removeItem(key)
  }
}
```
## 截图上传
``` bash
export const shot = async () => {
  const loading = this.$loading({
    lock: true,
    text: '截图上传中......',
    spinner: 'el-icon-loading',
    background: 'rgba(0, 0, 0, 0.7)'
  })

  const video = document.getElementsByClassName('video-shot')[0]

  video.setAttribute('crossOrigin', 'Anonymous')
  var w = video.offsetWidth
  var h = video.offsetHeight

  var canvas = document.createElement('canvas')
  canvas.width = w
  canvas.height = h
  canvas.style.width = w + 'px'
  canvas.style.height = h + 'px'

  var context = canvas.getContext('2d')
  context.scale(0.75, 0.8)
  context.drawImage(video, 0, 0)

  var formdata = new FormData()
  formdata.append('file', dataURLtoFile(canvas.toDataURL('image/jpeg'), '视频截图.jpg'))
  const { data } = await axios.post('v1/file/normalUpload', formdata)

  loading.close()
  if (data.success) {
    this.$message({ type: 'success', message: '上传截图成功！' })
  } else {
    this.$message({ type: 'error', message: '上传截图失败！' })
  }
}
```
## 正则/格式化相关
* 千分位化
``` bash
export function thousands(value, digit) {
  if (value === '' || value === undefined || value === null || isNaN(value)) return
  if (!digit) {
    value = value.toString()
  } else {
    const decimal = new Decimal(value)
    value = decimal.toFixed(digit, Decimal.ROUND_HALF_UP)
  }
  if (/\./.test(value)) {
    return value.replace(/\d(?=(\d{3})+\.)/g, '$&,').replace(/\d{3}(?![.]|$)/g, '$&')
  } else {
    return value.replace(/\d(?=(\d{3})+$)/g, '$&,')
  }
}
```
* URL
``` bash
export function validateURL(textval) {
  const urlregex = /^(https?|http?|ftp):\/\/([a-zA-Z0-9.-]+(:[a-zA-Z0-9.&%$-]+)*@)*((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9][0-9]?)(\.(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9]?[0-9])){3}|([a-zA-Z0-9-]+\.)*[a-zA-Z0-9-]+\.(com|edu|gov|int|mil|net|org|biz|arpa|info|name|pro|aero|coop|museum|[a-zA-Z]{2}))(:[0-9]+)*(\/($|[a-zA-Z0-9.,?'\\+&%$#=~_-]+))*$/
  return urlregex.test(textval)
}
```
* 获取URL中指定参数值
``` bash
export function getQueryString(name) {
  const href = window.location.href
  const reg = new RegExp(name + '=[^&|#|\/]*')
  const res = href.match(reg)
  return res ? href.match(reg)[0].split('=')[1] : ''
}
```
* 邮箱
``` bash
export function validateEmail(email) {
  let emails = email.replace(/^\s+|\s+$/g, "");
  return /^[\w\-+]+(\.[\w\-+]+)*@(\w-?)+(\.\w{2,})+$/.test(emails);
}
```
* 整数
``` bash
export function isInteger(num) {
  if (typeof num === 'number' && !isNaN(num) && num % 1 === 0) {
    return true
  } else {
    return false
  }
  // 也可以用Number.isInteger或正则
  // 用parseInt来判断是否等于自身的方法，针对超大数值会出问题
}
```
* 正整数
``` bash
export function validateNumber(str) {
  const reg = /^[0-9]*[1-9][0-9]*$/
  return reg.test(str)
  // number > 0 && Number.isInteger(Number(number))
}
```
* 数值
``` bash
export function validateNumber(str) {
  const regPos = /^\d+(\.\d+)?$/
  const regNeg = /^(-(([0-9]+\.[0-9]*[1-9][0-9]*)|([0-9]*[1-9][0-9]*\.[0-9]+)|([0-9]*[1-9][0-9]*)))$/
  return regPos.test(str) || regNeg.test(str)
}
```
* 保留2位小数点
``` bash
export function validateAnyPoint(str) {
  const reg = /^(([1-9]{1}\d*)|(0{1}))(\.\d{2})$/
  return reg.test(str)
}
```
* 保留至少2位小数点
``` bash
export function validateAnyPoint(str) {
  const reg = /^(([1-9]{1}\d*)|(0{1}))(\.\d{1,2})?$/
  return reg.test(str)
}
```
* 验证密码至少8位，需包含数字、英文字母、特殊符号（~!@#$%^&*）
``` bash
export function validateStrongPassword(str) {
  const reg = /^(?=.*\d)(?=.*[a-zA-Z])(?=.*[~!@#$%^&*])[\da-zA-Z~!@#$%^&*]{8,}$/
  return reg.test(str)
}
```
* 是否是汉字
``` bash
export function validateStrongPassword(str) {
  const reg = /^[\u4e00-\u9fa5]+$/
  return reg.test(str)
}
```
* 是否是身份证
``` bash
export function isCardNo(card) {
  var _IDRe18 = /^([1-6][1-9]|50)\d{4}(18|19|20)\d{2}((0[1-9])|10|11|12)(([0-2][1-9])|10|20|30|31)\d{3}[0-9XxZz]$/
  var _IDre15 = /^([1-6][1-9]|50)\d{4}\d{2}((0[1-9])|10|11|12)(([0-2][1-9])|10|20|30|31)\d{3}$/
  return _IDRe18.test(card) || _IDre15.test(card)
}
```
* 是否是银行卡
``` bash
export function isBankCard(card) {
  var reg = new RegExp(/^([1-9]{1})(\d{11}|\d{15}|\d{16}|\d{17}|\d{18})$/)
  return reg.test(card)
}
```
* 是否是电话号码，包括手机号、座机号
``` bash
export function validateTelephone(obj) {
  var pattern = /^(^(\d{3,4}-)?\d{7,8})$|(^1[3|4|5|7|8][0-9]{9})$/
  return pattern.test(obj)
}
```