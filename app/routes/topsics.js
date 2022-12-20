/*
 * @Author: six one six
 * @Date: 2022-12-13 17:26:10
 * @LastEditors: six one six
 * @LastEditTime: 2022-12-18 17:43:07
 * @Description: 
 */
const Router = require('koa-router')

const koaJwt = require('koa-jwt')

const config = require('../config')

const router = new Router({prefix: '/topics'})
const topicsCtr = require('../contorllers/topics')

// 手写jwt签名
// const jsonwebtoken = require('jsonwebtoken')
// jwt认证token
// const auth = async (ctx, next) => {
//   const {authorization = ''} = ctx.header
//   const token = authorization.replace('Bearer ', '')
  
//   try {
//     const user = jsonwebtoken.verify(token, config.signSecret)
//     ctx.state.user = user
//     console.log('auth成功====》', user)
//   } catch (error) {
//     ctx.throw(401, error.message)
//   }
//   await next()
// }
// jwt认证
const auth = koaJwt({secret: config.signSecret})

router.get('/', topicsCtr.getTopicList)

router.post('/', auth, topicsCtr.addOneTopic)

router.get('/:id', auth, topicsCtr.findOneTopic)
router.patch('/:id', auth, topicsCtr.updateOneTopic)


module.exports = router