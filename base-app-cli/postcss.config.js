module.exports = {
  // 如果vue.config.js中设置了则失效
  plugins: [
    require('autoprefixer')(),
    require('postcss-pxtorem')({
      rootValue: 37.5, // 设计稿尺寸/10
      unitPrecision: 5,
      propList: ['*'],
      selectorBlackList: [],
      replace: true,
      mediaQuery: false,
      minPixelValue: 0,
      exclude: /node_modules/i
    })
  ]
}
