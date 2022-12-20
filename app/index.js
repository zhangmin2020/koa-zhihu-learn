/*
 * @Author: six one six
 * @Date: 2022-12-13 13:44:59
 * @LastEditors: six one six
 * @LastEditTime: 2022-12-16 11:27:00
 * @Description: 
 */
const path = require('path')
const Koa = require('koa')

const {koaBody} = require('koa-body')
const jsonError = require('koa-json-error')
const parameter = require('koa-parameter')

const koaStatic = require('koa-static')

const mongoose = require('mongoose')

const config = require('./config')

const createRoutes = require('./routes')

const app = new Koa()

mongoose.connect(config.dbUrl, () => console.log('数据库链接成功'))
mongoose.set('strictQuery', false)
mongoose.connection.on('error', console.error)

// 静态文件服务器
app.use(koaStatic(path.join(__dirname, 'public')))

// 错误处理
app.use(jsonError({
  postFormat(err, {stack, ...rest}) {
    if (process.env.NODE_ENV === 'production') {
      return rest
    } else {
      return {stack, ...rest}
    }
  }
}))

// 解析请求体 ctx.request.body 还能解析上传文件并上传到指定文件夹
app.use(koaBody({
  multipart: true,
  formidable: {
    uploadDir: path.join(__dirname, '/public/uploads'),
    keepExtensions: true
  }
}))

// 校验请求体参数
app.use(parameter(app)) 

createRoutes(app)

app.listen(3000)