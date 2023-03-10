/*
 * @Author: six one six
 * @Date: 2022-12-13 17:26:10
 * @LastEditors: six one six
 * @LastEditTime: 2022-12-18 17:04:15
 * @Description: 
 */
const Router = require('koa-router')

const koaJwt = require('koa-jwt')

const config = require('../config')

const router = new Router({prefix: '/users'})
const userCtr = require('../contorllers/users')

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

router.get('/', auth, userCtr.getUserList)

router.post('/', auth, userCtr.addOneUser)

router.get('/:id', auth, userCtr.findOneUser)

router.patch('/:id', auth, userCtr.updateOneUser)
router.delete('/:id', auth, userCtr.deleteOneUser)

router.post('/login', userCtr.login)

// 关注某人
router.put('/following/:id', auth, userCtr.checkUserExist, userCtr.postFollowOneUser)
router.delete('/unfollowing/:id', auth, userCtr.checkUserExist, userCtr.unFollowOneUser)

// 获取关注列表
router.get('/:id/following-list', auth, userCtr.getFollowIngList)

// 获取关注列表
router.get('/:id/fans-list', auth, userCtr.getFansList)

module.exports = router