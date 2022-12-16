/*
 * @Author: six one six
 * @Date: 2022-12-13 17:30:31
 * @LastEditors: six one six
 * @LastEditTime: 2022-12-13 17:37:01
 * @Description: 
 */
const fs = require('fs')

module.exports = (app) => {
  fs.readdirSync(__dirname).forEach(dirname => {
    if (dirname !== 'index.js') {
      const router = require(`./${dirname}`)
      app.use(router.routes()).use(router.allowedMethods())
    }
  })
}
