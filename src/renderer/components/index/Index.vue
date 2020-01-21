<template>
  <el-container>
    <!-- <el-header>Music</el-header> -->
    <el-main>
      <ul class="msg-list" ref="msglist">
        <li v-for="(item, index) in msgList" :key="index" v-html="item" @click="getNodeImg"></li>
      </ul>
      <div class="im-chat margin-top" ref="msgchat" contentEditable="true" @input="onInput" @focus="onFocus" @keydown="onKeyDown"></div>
      <!-- 发送消息按钮 -->
      <el-dropdown class="multi-sendbtn margin-top" split-button type="primary" @click="sendMsg" @command="changeSendType">
        发送
        <el-dropdown-menu slot="dropdown" class="send-multi-btn">
          <el-dropdown-item command="Enter" :icon="enterCheck ? 'el-icon-check' : ' '">按Enter键发送消息</el-dropdown-item>
          <el-dropdown-item command="CtrlEnter" :icon="!enterCheck ? 'el-icon-check' : ' '">按Ctrl+Enter键发送消息</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    	<!-- <el-button class="full-width margin-top" type="primary" @click="toList" :loading="saveLoading">Print</el-button> -->
    </el-main>
  </el-container>
</template>

<script>
import { Container, Header, Main, Input, Button, Dropdown, DropdownMenu, DropdownItem } from 'element-ui'
import { ipcRenderer, clipboard } from 'electron'
import fs from 'fs'

const Store = require('electron-store')
const Storage = new Store()

export default {
  name: 'Index',
  components: {
    [Container.name]: Container,
    [Header.name]: Header,
    [Main.name]: Main,
    [Input.name]: Input,
    [Button.name]: Button,
    [Dropdown.name]: Dropdown,
    [DropdownMenu.name]: DropdownMenu,
    [DropdownItem.name]: DropdownItem
  },
  data () {
    return {
      content: '',
      saveLoading: false,
      msgList: [],
      enterCheck: true,
      localImgUploadAPI: 'http://test-svr.nn.com/upload/image',
      networkImgUploadAPI: 'https://www.xxx.com/api/url/upload'
    }
  },
  mounted () {
    // 获取信息发送的方式
    if (Storage.get('msgSendType')) {
      if (Storage.get('msgSendType') === 'Enter') {
        this.enterCheck = true
      } else {
        this.enterCheck = false
      }
    }
    // 点击了新窗口，按钮要不能点
    ipcRenderer.on('load-success', (event, params) => {
      this.saveLoading = false
    })
  },
  methods: {
    // 获取点击节点
    getNodeImg (e) {
      if (e.target.nodeName === 'IMG') {
        let params = {
          url: e.target.currentSrc,
          width: e.target.naturalWidth,
          height: e.target.naturalHeight
        }
        ipcRenderer.send('img-viewer', params)
      }
    },
    onFocus () {
      // 聚焦之后处理剪切板上的内容, 字符串转换成数组，以图片分割
      let clipHtml = clipboard.readHTML()
      // 剔除除图片和换行符外的任何标签
      let onlyImgAndBr = clipHtml.replace(/<(?!img|IMG|br|BR).*?>/g, '')
      // 继续剔除img和br的style属性
      let cullImgStyle = onlyImgAndBr.replace(/style\s*?=\s*?([‘"])[\s\S]*?\1/ig, '')
      // 重新写入剪切板
      clipboard.writeHTML(cullImgStyle)
    },
    onInput (e) {
      this.content = e.target.innerHTML
    },
    // 改变发送信息的方式
    changeSendType (command) {
      if (command === 'Enter') {
        this.enterCheck = true
        Storage.set('msgSendType', 'Enter')
      } else {
        this.enterCheck = false
        Storage.set('msgSendType', 'CtrlEnter')
      }
    },
    // 监听keydown事件
    onKeyDown (e) {
      if (this.enterCheck === true && e.key === 'Enter' && e.ctrlKey === false && e.shiftKey === false) {
        this.sendMsg()
        e.returnValue = false
      } else if (this.enterCheck === false && e.key === 'Enter' && e.ctrlKey === true) {
        this.sendMsg()
        e.returnValue = false
      }
    },
    sendMsg () {
      if (this.content.length < 1) {
        return console.log('发送内容不能为空，请重新输入')
      }
      let contentArr = this.content.split(/(<img\b[^>]*>)/)

      contentArr.forEach((item, index, arr) => {
        if (item.indexOf('<img') !== -1) {
          // 替换图片中的链接,发送图片
          item.replace(/<img [^>]*src=['"]([^'"]+)[^>]*>/g, (match, capture) => {
            // 本地图片上传
            if (capture.indexOf('file:///') !== -1 || capture.indexOf('C:') !== -1) {
              // 去除图片链接中的file:///
              let finalImgSrc = capture.indexOf('file:///') !== -1 ? capture.slice(8) : capture
              // 上传本地图片到oss
              fs.readFile(finalImgSrc, (err, data) => {
                if (err) throw err
                let formData = new FormData()
                formData.append('file', new Blob([data]))
                this.$http.post(this.localImgUploadAPI, formData)
                  .then(res => {
                    if (res.data.code === 0) {
                      console.log('Upload Local Img Success: ' + res.data.data.url)
                      // 替换图片中的链接为cdn图片
                      this.msgList.push(`<img src="${res.data.data.url}" />`)
                    } else {
                      console.log('Upload Local Img Error: ' + res.data)
                    }
                  })
              })
            } else {
              // 网络图片上传
              this.$http.post(this.localImgUploadAPI, {
                url: capture,
                object: 'image'
              }).then(res => {
                if (res.data.code === 0) {
                  console.log('Upload Network Img Success: ' + res.data.data.url)
                  this.msgList.push(`<img src="${res.data.data.url}" />`)
                } else {
                  console.log('Upload Network Img Error: ' + res.data)
                }
              })
            }
          })
        } else {
          // 直接发送文字消息
          this.msgList.push(item)
        }
      })

      // let str = this.content
      // let re = /<img\b[^>]*>/
      // let re2 = /src=[\'\"]?([^\'\"]*)[\'\"]?/i // eslint-disable-line
      // // // console.log(str.match(re)[0])
      // let imgSrc = str.match(re2)[1].slice(8)

      // 清空输入框
      this.$refs.msgchat.innerHTML = ''
      this.content = ''
    }
    // toList () {
    //   this.msgList.push(`<img src="xxxx" />`)
    // }
  }
}
</script>

<style scoped>
ul.msg-list {
  box-sizing: border-box;
  padding: 10px;
  background: #f3f3f3;
  height: 300px;
  overflow-y: auto;
}
ul.msg-list li {
  margin-top: 10px;
}
.margin-top {
  margin-top: 20px;
}
.el-header {
  line-height: 60px;
  font-size: 28px;
  text-align: center;
}
.full-width {
  width: 100%;
}
.im-chat {
  box-sizing: border-box;
  background: #222;
  color: #fff;
  height: 200px;
  word-break: break-all;
  word-break: break-word;
  overflow-y: auto;
  padding: 10px;
}
.multi-sendbtn {
  display: flex;
  justify-content: flex-end;
}
</style>

<style>
.im-chat img {
  max-height: 100%!important;
  max-width: 50%!important;
}
ul li img {
  max-width: 50%!important;
  max-height: 100%!important;
}
</style>
