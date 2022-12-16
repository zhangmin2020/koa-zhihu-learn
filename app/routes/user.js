/*
 * @Author: six one six
 * @Date: 2022-12-13 17:26:10
 * @LastEditors: six one six
 * @LastEditTime: 2022-12-15 16:41:02
 * @Description: 
 */
const Router = require('koa-router')

// 手写jwt签名
// const jsonwebtoken = require('jsonwebtoken')
// 认证token
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

const koaJwt = require('koa-jwt')

const config = require('../config')

const router = new Router({prefix: '/users'})
const userCtr = require('../contorllers/users')

const auth = koaJwt({secret: config.signSecret})

router.get('/', auth, userCtr.getUserList)

router.post('/', auth, userCtr.addOneUser)

router.get('/:id', auth, userCtr.findOneUser)

router.patch('/:id', auth, userCtr.updateOneUser)
router.delete('/:id', auth, userCtr.deleteOneUser)

router.post('/login', userCtr.login)

module.exports = router