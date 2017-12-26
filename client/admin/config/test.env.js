'use strict'
const merge = require('webpack-merge')
const devEnv = require('./dev.env')

module.exports = merge(devEnv, {
  NODE_ENV: '"testing"',
  BASE_URL: '"http://dev.admin.linvanda.com"',
  API_URL: '"http://dev.api.linvanda.com"',
  UPLOAD_URL: '"http://dev.api.linvanda.com/admin/media/images"'
})
