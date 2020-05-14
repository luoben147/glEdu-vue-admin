'use strict'
const merge = require('webpack-merge')
const prodEnv = require('./prod.env')

module.exports = merge(prodEnv, {
  NODE_ENV: '"development"',
  //BASE_API: '"https://easy-mock.com/mock/5950a2419adc231f356a6636/vue-admin"',
  //BASE_API: '"http://localhost:9001"',  //nginx 代理地址
  BASE_API: '"http://localhost:8222"',  //gateway网关地址
  OSS_PATH: '"https://gl-edu.oss-cn-beijing.aliyuncs.com"'
})
