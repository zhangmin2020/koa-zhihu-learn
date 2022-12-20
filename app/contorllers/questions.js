/*
 * @Author: six one six
 * @Date: 2022-12-13 18:11:02
 * @LastEditors: six one six
 * @LastEditTime: 2022-12-19 16:14:42
 * @Description: 
 */

const QuestionsModel = require('../models/Questions')

class QuestionsCtr {
  async getQuestionList(ctx) {
    const pageCurrent = Math.max((ctx.query.pageCurrent || 1) * 1, 1)
    const pageSize = Math.max((ctx.query.pageSize || 10) * 1, 1)
    const keyword = ctx.query.keyword
    ctx.body = await QuestionsModel.find({$or: [{title: keyword}, {description: keyword}]}).limit(pageSize).skip(pageSize * (pageCurrent - 1))
  }
  async addOneQuestion(ctx) { 
    // 校验请求体
    ctx.verifyParams({
      title: {type: 'string', required: true},
      description: {type: 'string', required: false}
    })
    
    const Question = await new QuestionsModel({...ctx.request.body, questioner: ctx.state.user._id}).save()
    ctx.body = Question
  }
  async findOneQuestion(ctx) {
    const {fields=''} = ctx.query
    const filterFields = fields.split(';').filter(item => !!item).map(item => ' +'+item).join('')
    const Question = await QuestionsModel.findById(ctx.params.id).select(filterFields).populate('questioner')
    
    if (!Question) {
      ctx.throw(404, '未找到该问题')
    }
    ctx.body = Question
  }

  async checkQuestionExist(ctx, next) {
    const Question = await QuestionsModel.findById(ctx.params.id)
    if (!Question) {
      ctx.throw(404, '问题不存在')
    }
    await next()
  }
  async checkQuestioner(ctx, next) {
    const Question = await QuestionsModel.findById(ctx.params.id)
    if (Question.questioner.toString() !== ctx.state.user._id) {
      ctx.throw(403, '没有权限')
    }
    await next()
  }

  async updateOneQuestion(ctx) { 
    ctx.verifyParams({
      title: {type: 'string', required: false},
      description: {type: 'string', required: false}
    })
    const Question = await QuestionsModel.findByIdAndUpdate(ctx.params.id, ctx.request.body)
    if (!Question) {
      ctx.throw(404, '未找到该问题')
    }
    ctx.body = Question
  }

  async deleteOneQuestion(ctx) { 
    
    const Question = await QuestionsModel.findByIdAndRemove(ctx.params.id)
    if (!Question) {
      ctx.throw(404, '未找到该问题')
    }
    ctx.body = Question
  }
  
}

module.exports = new QuestionsCtr()