/*
 * @Author: six one six
 * @Date: 2022-12-13 18:11:02
 * @LastEditors: six one six
 * @LastEditTime: 2022-12-19 18:03:01
 * @Description: 
 */

const AnswersModel = require('../models/Answers')

class AnswersCtr {
  async getAnswerList(ctx) {
    const pageCurrent = Math.max((ctx.query.pageCurrent || 1) * 1, 1)
    const pageSize = Math.max((ctx.query.pageSize || 10) * 1, 1)
    const keyword = ctx.query.keyword
    ctx.body = await AnswersModel.find({content: keyword, questionId: ctx.params.questionId}).limit(pageSize).skip(pageSize * (pageCurrent - 1))
  }
  async addOneAnswer(ctx) { 
    // 校验请求体
    ctx.verifyParams({
      content: {type: 'string', required: true}
    })
    
    const Answer = await new AnswersModel({...ctx.request.body, answerer: ctx.state.user._id, questionId: ctx.params.questionId}).save()
    ctx.body = Answer
  }
  async findOneAnswer(ctx) {
    const {fields=''} = ctx.query
    const filterFields = fields.split(';').filter(item => !!item).map(item => ' +'+item).join('')
    const Answer = await AnswersModel.findById(ctx.params.id).select(filterFields).populate('Answerer')
    
    if (!Answer) {
      ctx.throw(404, '未找到该答案')
    }
    ctx.body = Answer
  }

  async checkAnswerExist(ctx, next) {
    const Answer = await AnswersModel.findById(ctx.params.id)
    if (!Answer) {
      ctx.throw(404, '答案不存在')
    }
    if (Answer.questionId !== ctx.params.questionId) {
      ctx.throw(404, '该问题下没有此答案')
    }
    await next()
  }
  async checkAnswerer(ctx, next) {
    const Answer = await AnswersModel.findById(ctx.params.id)
    if (Answer.answerer.toString() !== ctx.state.user._id) {
      ctx.throw(403, '没有权限')
    }
    await next()
  }

  async updateOneAnswer(ctx) { 
    ctx.verifyParams({
      content: {type: 'string', required: false}
    })
    const Answer = await AnswersModel.findByIdAndUpdate(ctx.params.id, ctx.request.body)
    if (!Answer) {
      ctx.throw(404, '未找到该答案')
    }
    ctx.body = Answer
  }

  async deleteOneAnswer(ctx) { 
    
    const Answer = await AnswersModel.findByIdAndRemove(ctx.params.id)
    if (!Answer) {
      ctx.throw(404, '未找到该答案')
    }
    ctx.body = Answer
  }
  
}

module.exports = new AnswersCtr()