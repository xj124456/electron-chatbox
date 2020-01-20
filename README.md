# electron-chatbox
> electron-chatbox是一个集图文聊天输入框，图片预览的项目，你可以上手即用，只需要更改很小的地方即可

## Features
* 图片+文字聊天
* 图文混合输入
* 富文本自动剔除样式
* 复制图文输入
* 聊天图片直传云存储
* 原生聊天图片预览

## How To Use
```
# 克隆仓库
git clone https://github.com/xj124456/electron-chatbox.git
# 切换到仓库目录
cd electronic-chatbox
# 安装依赖
npm install
```
```
# 别着急运行项目, 你得先更改几项配置
更改 src\renderer\components\index\Index.vue 中上传图片的地址
localImgUploadAPI: 'https://www.xxx.com/api/image/upload',
networkImgUploadAPI: 'https://www.xxx.com/api/url/upload'
```
```
# 最后运行项目
npm run dev
```

## Question & Answer
* 为什么要把聊天记录上传到云存储？ 
- 你发送的图片路径是本地的，你可以看到发送的图片，可对方看不到你发送的图片
