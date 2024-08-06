const path = require('path')
const CompressionPlugin = require('compression-webpack-plugin')
const pkg = require('./package.json')

const isProd = process.env.NODE_ENV === 'production'

module.exports = {
  productionSourceMap: true,
  configureWebpack: function() {
    return {
      resolve: {
        alias: {
          '@': path.resolve(__dirname, './src'),
          'views': path.resolve(__dirname, './src/views')
        }
      },
      externals: {
        'AMap': 'AMap'
      },
      plugins: [
        new CompressionPlugin({
          filename: '[path].gz[query]',
          algorithm: 'gzip', // gz压缩需要服务端开启支持
          test: /\.js$|\.html$|\.css/,
          threshold: 10240,
          // deleteOriginalAssets: false, // 不删除源文件
          minRatio: 0.8 // 压缩比
        })
      ]
    }
  },
  chainWebpack: function(config) {
    if (pkg && pkg.version) {
      config.plugin('define')
        .tap(([options]) => {
          options['process.env']['VUE_APP_NAME'] = `"${pkg.name}"`
          options['process.env']['VUE_APP_VERSION'] = `"${pkg.version}"`
          return [options]
        })
    }
    config
      .when(process.env.NODE_ENV !== 'development',
        config => {
          config
            .optimization.splitChunks({
              chunks: 'all',
              cacheGroups: {
                elementUI: {
                  name: 'chunk-elementUI', // split elementUI into a single package
                  priority: 20, // the weight needs to be larger than libs and app or it will be packaged into libs or app
                  test: /[\\/]node_modules[\\/]_?element-ui(.*)/ // in order to adapt to cnpm
                },
                vueDist: {
                  name: 'chunk-vue', // split elementUI into a single package
                  priority: 20, // the weight needs to be larger than libs and app or it will be packaged into libs or app
                  test: /[\\/]node_modules[\\/]_?(vue|vue-router|vuex)(.*)/ // in order to adapt to cnpm
                }
              }
            })
        })

    config.module
      .rule('eslint')
      .use('eslint-loader')
      .loader('eslint-loader')
      .tap(options => {
        options.fix = true
        return options
      })
  },
  css: {
    // 是否使用css分离插件 mini-css-extract-plugin/extract-text-webpack-plugin
    extract: !!isProd,
    // 开启 CSS source maps?
    sourceMap: false,
    // css预设器配置项
    // loaderOptions: {
    //   // 给 sass-loader 传递选项
    //   scss: {
    //     // @/ 是 src/ 的别名
    //     // 所以这里假设你有 `src/variables.sass` 这个文件
    //     // 注意：在 sass-loader v7 中，这个选项名是 "data"
    //     prependData: `@import "~@/common/css/el-variable.scss";`
    //   }
    // },
    // 启用 CSS modules for all css / pre-processor files.
    requireModuleExtension: true
  },
  devServer: {
    https: false,
    port: '8064',
    clientLogLevel: 'warning',
    overlay: {
      warnings: false,
      errors: false
    },
    proxy: {
      '^/v1': {
        target: '/',
        changeOrigin: true,
        onProxyReq: function(proxyReq) {
          proxyReq.removeHeader('origin')
        }
      }
    }
  }
}
