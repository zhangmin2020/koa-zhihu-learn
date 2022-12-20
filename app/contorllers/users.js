/*
 * @Author: six one six
 * @Date: 2022-12-13 18:11:02
 * @LastEditors: six one six
 * @LastEditTime: 2022-12-19 16:16:46
 * @Description: 
 */
const jsonwebtoken = require('jsonwebtoken')
const config = require('../config')

const UserModel = require('../models/users')



class UsersCtr {
  async getUserList(ctx) {
    const pageCurrent = Math.max((ctx.query.pageCurrent || 1) * 1, 1)
    const pageSize = Math.max((ctx.query.pageSize || 2) * 1, 1)
    ctx.body = await UserModel.find({name: new RegExp(ctx.query.keyword)}).limit(pageSize).skip(pageSize * (pageCurrent - 1))
  }
  async addOneUser(ctx) { 
    // 校验请求体
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
    const {fields=''} = ctx.query
    const filterFields = fields.split(';').filter(item => !!item).map(item => ' +'+item).join('')
    const user = await UserModel.findById(ctx.params.id).select(filterFields).populate('following locations business employments.company employments.job educations.school educations.major')
    
    if (!user) {
      ctx.throw(404, '未找到该用户')
    }
    ctx.body = user
  }
  async updateOneUser(ctx) { 
    ctx.verifyParams({
      name: {type: 'string', required: false},
      password: {type: 'string', required: false},
      avatar_url: {type: 'string', required: false},
      gender: {type: 'string', required: false},
      headline: {type: 'string', required: false},
      locations: {type: 'array', itemType: 'string', required: false},
      business: {type: 'string', required: false},
      employments: {type: 'array', itemType: 'object',  required: false},
      educations: {type: 'array', itemType: 'object',  required: false},
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

  // 关注某人
  async postFollowOneUser(ctx) {
    const me = await UserModel.findById(ctx.state.user._id).select(' +following')
    console.log(222, me)
    const followId = ctx.params.id
    if (me && !me.following.map(id => id.toString()).includes(followId) && me._id !== followId) {
      me.following.push(followId)
      me.save()
    } else {
      console.log(444)
    }
    ctx.status = 204
  }
  
  // 校验用户是否存在
  async checkUserExist(ctx, next) {
    const user = await UserModel.findById(ctx.params.id)
    if (!user) {
      ctx.throw(404, '该用户不存在')
    }
    await next()
  }

  
  // 取消关注某人
  async unFollowOneUser(ctx) {
    const me = await UserModel.findById(ctx.state.user._id).select(' +following')
    console.log(222, me)
    const followId = ctx.params.id
    if (me && me._id !== followId) {
      const index = me.following.map(id => id.toString()).indexOf(followId)
      if (index > -1) {
        me.following.splice(index, 1)
        me.save()
      }
    } else {
      console.log(444)
    }
    ctx.status = 204
  } 
b
  // 获取某人的关注列表
  async getFollowIngList(ctx) {
    const user = await UserModel.findById(ctx.params.id).select(' +following').populate('following')
    if (!user) {
      ctx.throw(404, '未找到该用户')
    }
    ctx.body = user.following
  }
  // 获取某人的粉丝列表
  async getFansList(ctx) {
    const users = await UserModel.find({following: ctx.params.id})
    if (!users) {
      ctx.throw(404, '未找到该用户')
    }
    ctx.body = users
  }

  // 获取某人的问题列表
  async getUserQuestionList(ctx) {
    const questions = await QuestionsModel.find({questioner: ctx.params.id})
    if (!questions) {
      ctx.throw(404, '未找到问题列表')
    }
    ctx.body = questions
  }
}

module.exports = new UsersCtr()