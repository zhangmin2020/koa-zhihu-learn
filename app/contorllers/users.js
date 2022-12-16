/*
 * @Author: six one six
 * @Date: 2022-12-13 18:11:02
 * @LastEditors: six one six
 * @LastEditTime: 2022-12-15 15:59:31
 * @Description: 
 */
const jsonwebtoken = require('jsonwebtoken')
const config = require('../config')

const UserModel = require('../models/users')



class UsersCtr {
  async getUserList(ctx) {
    ctx.body = await UserModel.find()
  }
  async addOneUser(ctx) { 
    ctx.verifyParams({
      name: {type: 'string', required: true},
      password: {type: 'string', required: true},
    })
    const {name} = ctx.request.body
    const curUser = await UserModel.findOne({name})
    if (curUser) {
      ctx.throw(409, '用户已存在')
    }
    const user = await new UserModel(ctx.request.body).save()
    ctx.body = user
  }
  async findOneUser(ctx) {
    const user = await UserModel.findById(ctx.params.id)
    if (!user) {
      ctx.throw(404, '未找到该用户')
    }
    ctx.body = user
  }
  async updateOneUser(ctx) { 
    ctx.verifyParams({
      name: {type: 'string', required: false},
      password: {type: 'string', required: false},
    })
    const user = await UserModel.findByIdAndUpdate(ctx.params.id, ctx.request.body)
    if (!user) {
      ctx.throw(404, '未找到该用户')
    }
    ctx.body = user
  }
  async deleteOneUser(ctx) {
    const user = await UserModel.findByIdAndRemove(ctx.params.id)
    if (!user) {
      ctx.throw(404, '未找到该用户')
    }
    ctx.body = user
  }
  async login(ctx) {
    ctx.verifyParams({
      name: {type: 'string', required: true},
      password: {type: 'string', required: true},
    }) 
    const curUser = await UserModel.findOne(ctx.request.body)
    if (!curUser) {
      ctx.throw(401, '用户名或密码不正确')
    }
    const {_id, name} = curUser
    const token = jsonwebtoken.sign({_id, name}, config.signSecret, {expiresIn: '1d'})
    ctx.body = {token}
  }
}

module.exports = new UsersCtr()