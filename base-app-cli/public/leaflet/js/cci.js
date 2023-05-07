(function(){
	var userAgent = navigator.userAgent;
    var isAndroid = userAgent.indexOf("Android") > -1 || userAgent.indexOf("adr") > -1; //
    if(!isAndroid){
        return
    }
	
    var cci = {};
    cci.init = function (callback){
        if (window.WebViewJavascriptBridge) {
               if(typeof callback === "function" )
                    callback();
        } else {
            document.addEventListener('WebViewJavascriptBridgeReady', function () {
                WebViewJavascriptBridge.init(function(message,responseCallback){});
                    if(callback)
                        callback();
            },false);
       }
    }

    // 退出WebView
    cci.exit = function (){
        cci.init(function(){
            window.WebViewJavascriptBridge.callHandler('exit', null, null);
        });
    };
    // 退出登录
    cci.logout = function(message){
        cci.init(function(){
            message = typeof message !== 'undefined' ? message : null;
            WebViewJavascriptBridge.callHandler('logout', message, null);
        })
    };

    // 登录失效，或需要登录时跳转
    cci.login = function(message){
        cci.init(function(){
            message = typeof message !== 'undefined' ? message : null;
                WebViewJavascriptBridge.callHandler('login', message, null);
        })
    };

    // 获取用户信息
    cci.getUserInfo = function (callback){
        cci.init(function(){
            WebViewJavascriptBridge.callHandler('getUserInfo', null, function (userInfo) {
                if(typeof callback === "function"){
                   callback(JSON.parse(userInfo||"{}"));
                }
            })
        })
    };

    // 获取位置信息 (支持三种，WGS84,BD0911（百度坐标系）,GCJ02（高德坐标系）)
    cci.getLocation = function (param,callback){
        cci.init(function(){
              WebViewJavascriptBridge.callHandler('getLocation', param , function (location) {
                 if(typeof callback === "function")
                     callback(JSON.parse(location|| "{}"));
           })
        });
    }

    // 语音转文字
    cci.speech2Text = function (callback){
        cci.init(function(){
           WebViewJavascriptBridge.callHandler('speech2Text',null,function(text){
             if(callback)
                 callback(text);
              })
        })
    }

    // 设置状态栏颜色
    // 格式I #FFFFFF  #FFFFFFFF
    cci.statusBarColor = function(color){
        cci.init(function(){
            WebViewJavascriptBridge.callHandler('statusBarColor',color,null)
        })
    }

    // 使用沉浸模式
    // true 开启，false 关闭
    cci.enableImmersiveMode = function(enable){
        enable = enable === undefined ? true : enable
        cci.init(function(){
            WebViewJavascriptBridge.callHandler('enableImmersiveMode', enable.toString(),null)
        })
    }

    // 显示导航栏
    // true 开启，false 关闭
    cci.showToolbar = function(enable){
         enable = enable === undefined ? true : enable
         cci.init(function(){
             WebViewJavascriptBridge.callHandler('showToolbar', enable.toString(),null)
         })
     }

    // 扫码
    cci.scanCode = function(callback){
        cci.init(function(){
          WebViewJavascriptBridge.callHandler('scanCode',null,function(text){
             if(callback)
                 callback(text);
             })
        })
    }

    //    {
    //        "phoneNumber": "130000xxxxx"
    //    }
    // 拨打电话
    cci.makePhoneCall = function(obj){
        cci.init(function(){
            WebViewJavascriptBridge.callHandler('makePhoneCall',JSON.stringify(obj) ,null)
        })
    }

    // 打开新浏览器，android 新的webview
    cci.openBrowser = function(url){
        cci.init(function(){
            WebViewJavascriptBridge.callHandler('openBrowser',url,null)
        })
    }

    // 获取设备信息
    cci.getDeviceInfo = function(callback){
        cci.init(function(){
            WebViewJavascriptBridge.callHandler('getDeviceInfo', null, function (deviceInfo) {
                if(typeof callback === "function"){
                   callback(JSON.parse(deviceInfo||"{}"));
                }
            })
        })
    }

    // 地图导航
    // 坐标系统一为 GCJ02
    //    navType: 导航类型，1，高德； 2，百度； 3，腾讯
    //    mode： mode  0（驾车）、 1（公交）、 2（步行）
    //    oLat： origin 源地址维度
    //    oLng:  origin 源地址经度
    //    oName: origin 源地址名称
    //    dLat： destination 目标地址纬度
    //    dLng:  destination 目标地址经度
    //    dName: destination 目标地址名称
    cci.mapNav = function(navObj){
        cci.init(function(){
           WebViewJavascriptBridge.callHandler('mapNav',JSON.stringify(navObj),null)
        })
    }

    // 播放 视频，音频，及图片预览。
    cci.play = function(obj){
        cci.init(function(){
            WebViewJavascriptBridge.callHandler('play',JSON.stringify(obj),null)
        })
    }

    // 复制文本到粘贴板
    cci.setPrimaryClip = function (obj) {
        cci.init(function () {
            WebViewJavascriptBridge.callHandler('setPrimaryClip', JSON.stringify(obj), null)
        })
    }

    // 发送短信
    cci.sendSms = function(obj){
        cci.init(function(){
            WebViewJavascriptBridge.callHandler('sendSms',JSON.stringify(obj),null)
        })
    }
	
	// 跳转到app内部模块
    cci.toModule = function(obj){
         cci.init(function(){
             WebViewJavascriptBridge.callHandler('toModule',JSON.stringify(obj), null)
         })
    }
	
    cci.limitFile = function(obj){
        cci.init(function(){
            WebViewJavascriptBridge.callHandler('limitFile',JSON.stringify(obj),null)
        })
    }

    window.cci = cci;
    cci.init(null);
})()
