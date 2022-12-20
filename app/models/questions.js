/*
 * @Author: six one six
 * @Date: 2022-12-14 16:27:02
 * @LastEditors: six one six
 * @LastEditTime: 2022-12-19 16:22:40
 * @Description: 
 */
const mongoose = require('mongoose')

const { Schema, model } = mongoose

// select: false 不对外暴露该属性
const questionSchema = new Schema({
  __v: {type: Number, select: false},
  title: {type: String, required: true},
  description: {type: String},
  questioner: {type: Schema.Types.ObjectId, ref: 'User', required: true, select: false},
  topics: {
    type: [{type: Schema.Types.ObjectId, ref: 'Topics'}],
    select: false
  }
})

module.exports = model('Questions', questionSchema)