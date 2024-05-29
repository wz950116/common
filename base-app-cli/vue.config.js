const path = require('path')
const CompressionWebpackPlugin = require('compression-webpack-plugin')
const productionGzipExtensions = /\.(js|css|json|txt|html|ico|svg)(\?.*)?$/i
const proxy = require('./build/vue/proxy')
// const assetsCDN = require('./build/vue/cdn')

const resolve = (dir) => {
  return path.join(__dirname, dir)
}

const isProd = process.env.NODE_ENV === 'production'

module.exports = {
  publicPath: process.env.VUE_APP_BASEURL || '/',
  assetsDir: 'static',
  productionSourceMap: false,
  chainWebpack: (config) => {
    config.plugin('html').tap((args) => {
      args[0].title = 'cci-mobile-base'
      return args
    })

    config.resolve.alias.set('@', resolve('./src'))

    config.module.rule('svg').include.add(resolve('./src/icons'))
    config.module.rule('svg').uses.delete('file-loader')
    config.module
      .rule('svg')
      .test(/\.(svg)(\?.*)?$/)
      .use('svg-sprite-loader')
      .loader('svg-sprite-loader')
      .options({
        symbolId: 'icon-[name]'
      })

    if (isProd) {
      //  开启CDN加载公共库
      // config.plugin('html').tap(args => {
      //   args[0].cdn = assetsCDN
      //   return args
      // })

      // gzip开启
      config.plugin('compressionPlugin').use(
        new CompressionWebpackPlugin({
          filename: '[path].gz[query]',
          algorithm: 'gzip',
          test: productionGzipExtensions,
          threshold: 10240,
          minRatio: 0.8
          // deleteOriginalAssets: true
        })
      )
    }
  },
  configureWebpack: {
    externals: {}
  },
  devServer: {
    https: false,
    port: '8088',
    clientLogLevel: 'warning',
    overlay: {
      warnings: false,
      errors: false
    },
    proxy: proxy
  },
  pluginOptions: {
    // less 全局变量
    'style-resources-loader': {
      preProcessor: 'less',
      patterns: [
        path.resolve(__dirname, './src/styles/variables.less')
      ]
    }
  },
  css: {
    // 是否使用css分离插件 ExtractTextPlugin
    extract: !!isProd,
    // 开启 CSS source maps?
    sourceMap: false,
    // css预设器配置项
    // loaderOptions: {
    //   postcss: {
    //     plugins: [
    //       require('postcss-pxtorem')({
    //         rootValue: 37.5, // 设计稿尺寸/10
    //         propList: ['*']
    //       })
    //     ]
    //   }
    // },
    // 启用 CSS modules for all css / pre-processor files.
    requireModuleExtension: true
  }
}
