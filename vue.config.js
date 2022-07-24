const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: true,
  devServer : {
    host : "127.0.0.1",
    proxy: {
      '^/all': {
        target: 'http://127.0.0.1:12000',
      },
      '^/list': {
        target: 'http://127.0.0.1:12000',
      },
      '^/black': {
        target: 'http://127.0.0.1:12000',
      },
    }
  }
})
