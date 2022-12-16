/*
 * @Author: six one six
 * @Date: 2022-12-14 16:27:02
 * @LastEditors: six one six
 * @LastEditTime: 2022-12-15 15:17:30
 * @Description: 
 */
const mongoose = require('mongoose')

const { Schema, model } = mongoose

// select: false 不对外暴露该属性
const userSchema = new Schema({
  __v: {type: Number, select: false},
  name: {type: String, required: true},
  password: {type: String, required: true, select: true},
})

module.exports = model('User', userSchema)