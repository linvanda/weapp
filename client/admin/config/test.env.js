'use strict'
const merge = require('webpack-merge')
const devEnv = require('./dev.env')

module.exports = merge(devEnv, {
  NODE_ENV: '"testing"',
  BASE_URL: '"http://localhost:8080"',
  API_URL: '"http://www.linvanda.com:8088"',
  UPLOAD_URL: '"http://localhost:8080/admin/media/images"'
})
