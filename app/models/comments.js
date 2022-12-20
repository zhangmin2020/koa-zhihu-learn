/*
 * @Author: six one six
 * @Date: 2022-12-14 16:27:02
 * @LastEditors: six one six
 * @LastEditTime: 2022-12-20 11:53:06
 * @Description: 
 */
const mongoose = require('mongoose')

const { Schema, model } = mongoose

// select: false 不对外暴露该属性
const commentsSchema = new Schema({
  __v: {type: Number, select: false},
  content: {type: String, required: true},
  commentator: {type: Schema.Types.ObjectId, ref: 'User', required: true, select: false},
  questionId: {type: String, required: true},
  answerId: {type: String, required: true},
  rootCommentId: {type: String},
  replyTo: {type: Schema.Types.ObjectId, ref: 'User'}
}, {timestamps: true})

module.exports = model('Comments', commentsSchema)