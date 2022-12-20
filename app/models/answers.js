/*
 * @Author: six one six
 * @Date: 2022-12-14 16:27:02
 * @LastEditors: six one six
 * @LastEditTime: 2022-12-19 18:07:00
 * @Description: 
 */
const mongoose = require('mongoose')

const { Schema, model } = mongoose

// select: false 不对外暴露该属性
const answersSchema = new Schema({
  __v: {type: Number, select: false},
  content: {type: String, required: true},
  description: {type: String},
  answerer: {type: Schema.Types.ObjectId, ref: 'User', required: true, select: false},
  questionId: {type: String, required: true},
  voteCount: {type: Number, select: false, default: 0}
})

module.exports = model('Answers', answersSchema)