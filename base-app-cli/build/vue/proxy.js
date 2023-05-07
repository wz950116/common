module.exports = {
  '/mock': {
    target: 'http://10.32.86.47:8300',
    // 域名
    changOrigin: true
  },
  // 鉴权
  '/oauth2': {
    target: 'http://10.12.107.80:30000',
    changOrigin: true
  },
  // 这里要加末尾/，防止cadsHome页面被代理访问不到
  '^/cads/': {
    target: 'http://10.10.160.63:8081/', // 开发服务
    // 域名
    changOrigin: true
  },
  '^/agency': {
    target: 'http://10.10.160.63:7002/',
    changeOrigin: true
  },
  '^/dongguan': {
    target: 'http://10.162.204.13:9000/',
    changeOrigin: true
  },
  '/yuezy': {
    target: 'http://10.10.160.67:11006/', // 测试
    changOrigin: true
  }
}
