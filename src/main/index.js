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

  // ipcMain.removeAllListeners()
  mainWindow = new BrowserWindow({
    height: 600,
    width: 800,
    useContentSize: true,
    autoHideMenuBar: true,
    webPreferences: {
      webSecurity: false,
      nodeIntegration: true
    }
  })
  mainWindow.loadURL(winURL)

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
