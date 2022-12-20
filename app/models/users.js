/*
 * @Author: six one six
 * @Date: 2022-12-14 16:27:02
 * @LastEditors: six one six
 * @LastEditTime: 2022-12-19 18:18:32
 * @Description: 
 */
const mongoose = require('mongoose')

const { Schema, model } = mongoose

// select: false 不对外暴露该属性
const userSchema = new Schema({
  __v: {type: Number, select: false},
  name: {type: String, required: true},
  password: {type: String, required: true, select: true},
  avatar_url: {type: String},
  gender: {type: String, enum: ['male', 'female'], default: 'male', required: true},
  headline: {type: String},
  locations: {type: [{type: Schema.Types.ObjectId, ref: 'Topics'}], select: false},
  business: {type: Schema.Types.ObjectId, ref: 'Topics', select: false},
  employments: {
    select: false,
    type: [{
      company: {type: Schema.Types.ObjectId, ref: 'Topics'},
      job: {type: Schema.Types.ObjectId, ref: 'Topics'}
    }]
  },
  educations: {
    select: false,
    type: [{
      school: {type: Schema.Types.ObjectId, ref: 'Topics'},
      major: {type: Schema.Types.ObjectId, ref: 'Topics'},
      diplome: {type: Number, enum: [1, 2, 3, 4, 5]},
      entrance_year: {type: Number},
      graduation_year: {type: Number}
    }]
  },
  following: {
    type: [{type: Schema.Types.ObjectId, ref: 'User'}], 
    select: false
  },
  topics: {
    type: [{type: Schema.Types.ObjectId, ref: 'Topics'}], 
    select: false
  },

  linkingAnswers: {
    type: [{type: Schema.Types.ObjectId, ref: 'Answers'}], 
    select: false
  },
  disLinkingAnswers: {
    type: [{type: Schema.Types.ObjectId, ref: 'Answers'}], 
    select: false
  }
})

module.exports = model('User', userSchema)