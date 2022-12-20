/*
 * @Author: six one six
 * @Date: 2022-12-13 18:10:54
 * @LastEditors: six one six
 * @LastEditTime: 2022-12-16 13:37:19
 * @Description: 
 */
class HomeCtr {
  index(ctx) {
    ctx.body = '首页'
  }
  upload(ctx) { // 上传图片
    const file =ctx.request.files.file
    ctx.body = {
      filepath: file.filepath,
      url: `${ctx.origin}/uploads/${file.newFilename}`,
      size: file.size,
      mimetype: file.mimetype,
      originalFilename: file.originalFilename
    }
  }
}

module.exports = new HomeCtr()