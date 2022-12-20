/*
 * @Author: six one six
 * @Date: 2022-12-14 16:27:02
 * @LastEditors: six one six
 * @LastEditTime: 2022-12-18 18:51:42
 * @Description: 
 */
const mongoose = require('mongoose')

const { Schema, model } = mongoose

// select: false 不对外暴露该属性
const topicSchema = new Schema({
  __v: {type: Number, select: false},
  name: {type: String, required: true},
  avatar_url: {type: String},
  introduction: {type: String, select: false}
})

module.exports = model('Topics', topicSchema)