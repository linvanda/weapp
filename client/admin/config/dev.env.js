'use strict'
const merge = require('webpack-merge')
const prodEnv = require('./prod.env')

module.exports = merge(prodEnv, {
  NODE_ENV: '"development"',
  BASE_URL: '"http://dev.admin.linvanda.com"',
  API_URL: '"http://dev.api.linvanda.com"',
  UPLOAD_URL: '"http://dev.api.linvanda.com/admin/media/images"'
})
