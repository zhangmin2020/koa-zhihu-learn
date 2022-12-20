<!--
 * @Author: six one six
 * @Date: 2022-12-20 13:44:21
 * @LastEditors: six one six
 * @LastEditTime: 2022-12-20 13:50:34
 * @Description: 
-->
## 安装
apt-get install nginx

## 配置
nginx -t 查看配置信息

nginx.conf

server {
  listen 80;
  server_name localhost;
  location / {
    proxy_pass http://127.0.0.1:3000
  }
}