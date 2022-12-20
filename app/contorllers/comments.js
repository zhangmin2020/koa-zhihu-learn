/*
 * @Author: six one six
 * @Date: 2022-12-13 18:11:02
 * @LastEditors: six one six
 * @LastEditTime: 2022-12-20 13:44:26
 * @Description: 
 */

const CommentsModel = require('../models/Comments')

class CommentsCtr {
  async getCommentList(ctx) {
    const pageCurrent = Math.max((ctx.query.pageCurrent || 1) * 1, 1)
    const pageSize = Math.max((ctx.query.pageSize || 10) * 1, 1)
    const keyword = ctx.query.keyword
    ctx.body = await CommentsModel.find({content: keyword, questionId: ctx.params.questionId, answerId: ctx.params.answerId}).limit(pageSize).skip(pageSize * (pageCurrent - 1)).populate('commentator')
  }
  async addOneComment(ctx) { 
    // 校验请求体
    ctx.verifyParams({
      content: {type: 'string', required: true}
    })
    
    const Comment = await new CommentsModel({...ctx.request.body, commenter: ctx.state.user._id, questionId: ctx.params.questionId}).save()
    ctx.body = Comment
  }
  async findOneComment(ctx) {
    const {fields=''} = ctx.query
    const filterFields = fields.split(';').filter(item => !!item).map(item => ' +'+item).join('')
    const Comment = await CommentsModel.findById(ctx.params.id).select(filterFields).populate('Commenter')
    
    if (!Comment) {
      ctx.throw(404, '未找到该答案')
    }
    ctx.body = Comment
  }

  async checkCommentExist(ctx, next) {
    const Comment = await CommentsModel.findById(ctx.params.id)
    if (!Comment) {
      ctx.throw(404, '答案不存在')
    }
    if (Comment.questionId !== ctx.params.questionId) {
      ctx.throw(404, '该问题下没有此答案')
    }
    await next()
  }
  async checkCommenter(ctx, next) {
    const Comment = await CommentsModel.findById(ctx.params.id)
    if (Comment.commentator.toString() !== ctx.state.user._id) {
      ctx.throw(403, '没有权限')
    }
    await next()
  }

  async updateOneComment(ctx) { 
    ctx.verifyParams({
      content: {type: 'string', required: false}
    })
    const Comment = await CommentsModel.findByIdAndUpdate(ctx.params.id, ctx.request.body)
    if (!Comment) {
      ctx.throw(404, '未找到该答案')
    }
    ctx.body = Comment
  }

  async deleteOneComment(ctx) { 
    
    const Comment = await CommentsModel.findByIdAndRemove(ctx.params.id)
    if (!Comment) {
      ctx.throw(404, '未找到该答案')
    }
    ctx.body = Comment
  }
  
}

module.exports = new CommentsCtr()