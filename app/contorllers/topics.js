/*
 * @Author: six one six
 * @Date: 2022-12-13 18:11:02
 * @LastEditors: six one six
 * @LastEditTime: 2022-12-19 16:26:26
 * @Description: 
 */

const TopicsModel = require('../models/topics')
const QuestionsModel = require('../models/Questions')

class TopicsCtr {
  async getTopicList(ctx) {
    const pageCurrent = Math.max((ctx.query.pageCurrent || 1) * 1, 1)
    const pageSize = Math.max((ctx.query.pageSize || 10) * 1, 1)
    ctx.body = await TopicsModel.find({name: new RegExp(ctx.query.keyword)}).limit(pageSize).skip(pageSize * (pageCurrent - 1))
  }
  async addOneTopic(ctx) { 
    // 校验请求体
    ctx.verifyParams({
      name: {type: 'string', required: true},
      avatar_url: {type: 'string', required: false},
      introduction: {type: 'string', required: false},
    })
    
    const Topic = await new TopicsModel(ctx.request.body).save()
    ctx.body = Topic
  }
  async findOneTopic(ctx) {
    const {fields=''} = ctx.query
    const filterFields = fields.split(';').filter(item => !!item).map(item => ' +'+item).join('')
    const Topic = await TopicsModel.findById(ctx.params.id).select(filterFields)
    
    if (!Topic) {
      ctx.throw(404, '未找到该用户')
    }
    ctx.body = Topic
  }
  async updateOneTopic(ctx) { 
    ctx.verifyParams({
      name: {type: 'string', required: false},
      avatar_url: {type: 'string', required: false},
      introduction: {type: 'string', required: false},
    })
    const Topic = await TopicsModel.findByIdAndUpdate(ctx.params.id, ctx.request.body)
    if (!Topic) {
      ctx.throw(404, '未找到该用户')
    }
    ctx.body = Topic
  }
  async getQuestionList(ctx) {
    
    ctx.body = await QuestionsModel.find({topics: ctx.params.id})
  }
}

module.exports = new TopicsCtr()