/*
 * @Author: six one six
 * @Date: 2022-12-13 17:26:04
 * @LastEditors: six one six
 * @LastEditTime: 2022-12-16 10:57:02
 * @Description: 
 */
const Router = require('koa-router')
const router = new Router()

const homeCtr = require('../contorllers/home')

router.get('/', homeCtr.index)
router.post('/upload', homeCtr.upload)

module.exports = router