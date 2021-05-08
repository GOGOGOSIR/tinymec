module.exports = {
  chainWebpack: config => {
    config
      .plugin('webpack-bundle-analyzer')
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      .use(require('webpack-bundle-analyzer').BundleAnalyzerPlugin)
  }
}
