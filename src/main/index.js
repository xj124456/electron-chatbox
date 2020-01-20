'use strict'

import { app, BrowserWindow, ipcMain } from 'electron'

/**
 * Set `__static` path to static files in production
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-static-assets.html
 */
if (process.env.NODE_ENV !== 'development') {
  global.__static = require('path')
    .join(__dirname, '/static')
    .replace(/\\/g, '\\\\')
}

let mainWindow, imgWindow
const winURL =
  process.env.NODE_ENV === 'development'
    ? `http://localhost:9080`
    : `file://${__dirname}/index.html`

function createWindow () {
  /**
   * Initial window options
   */
  ipcMain.removeAllListeners()
  mainWindow = new BrowserWindow({
    height: 660,
    width: 800,
    autoHideMenuBar: true,
    webPreferences: {
      webSecurity: false,
      nodeIntegration: true,
      devTools: true
    }
  })
  mainWindow.loadURL(winURL)

  // 添加音乐窗口
  // ipcMain.on('add-music-window', (event, params) => {
  //   addWindow = new BrowserWindow({
  //     width: 500,
  //     height: 400,
  //     autoHideMenuBar: true,
  //     modal: true,
  //     webPreferences: {
  //       nodeIntegration: true,
  //       devTools: true
  //     },
  //     parent: mainWindow
  //   })
  //   addWindow.loadURL(`${winURL}#/add`)
  //   event.reply('load-success')
  // })

  // addWindow添加音乐文件
  // ipcMain.on('open-music-file', (event) => {
  //   dialog.showOpenDialog({
  //     properties: ['openFile', 'multiSelections'],
  //     filters: [{ name: 'Music', extensions: ['mp3'] }]
  //   }).then(res => {
  //     if (res.filePaths) {
  //       event.sender.send('selected-file', res.filePaths)
  //     }
  //   })
  // })

  // 导入音乐到曲库
  // ipcMain.on('add-tracks', (event, tracks) => {
  //   // const updateTracks = Storage.addTracks(tracks).getTracks()
  //   // console.log(updateTracks)
  // })

  // 采用原生窗口的图片预览
  ipcMain.on('img-viewer', (event, params) => {
    global.previewImgUrl = params.url
    imgWindow = new BrowserWindow({
      width: params.width,
      height: params.height,
      autoHideMenuBar: true,
      useContentSize: true,
      title: '图片预览',
      icon: ' ',
      webPreferences: {
        nodeIntegration: true,
        devTools: false
      }
    })
    imgWindow.loadURL(`${winURL}#/img-viewer`)
  })

  // 图片放大监听
  ipcMain.on('img-viewer-loaded', () => {
    imgWindow.webContents.send('imgdata', global.previewImgUrl)
  })
}

app.on('ready', createWindow)

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow()
  }
})
/**
 * Auto Updater
 *
 * Uncomment the following code below and install `electron-updater` to
 * support auto updating. Code Signing with a valid certificate is required.
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-electron-builder.html#auto-updating
 */

/*
import { autoUpdater } from 'electron-updater'

autoUpdater.on('update-downloaded', () => {
  autoUpdater.quitAndInstall()
})

app.on('ready', () => {
  if (process.env.NODE_ENV === 'production') autoUpdater.checkForUpdates()
})
 */
