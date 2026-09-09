'use strict'

import { app, protocol, BrowserWindow, ipcMain, screen, session } from 'electron'
import { createProtocol } from 'vue-cli-plugin-electron-builder/lib'

const axios = require('axios')
const Store = require('electron-store')

const store = new Store()
import net from 'net'
import path from 'path'
// import installExtension, { VUEJS_DEVTOOLS } from 'electron-devtools-installer'
const isDevelopment = process.env.NODE_ENV !== 'production'

// Scheme must be registered before the app is ready
protocol.registerSchemesAsPrivileged([
  { scheme: 'app', privileges: { secure: true, standard: true } }
])
let childWindow
let secondaryWindow
let thirdWindow
let fourthWindow
let win
let root_path
if (process.env.WEBPACK_DEV_SERVER_URL) {
  // Load the url of the dev server if in development mode
  root_path = process.env.WEBPACK_DEV_SERVER_URL
  console.log(root_path)
} else {
  root_path = `file://${__dirname}/index.html`
}

async function createWindow() {
  // Create the browser window.
  win = new BrowserWindow({
    width: 1200,
    height: 900,
    // frame: false,
    fullscreen: true,
    webPreferences: {

      // Required for Spectron testing
      // enableRemoteModule: !!process.env.IS_TEST,

      // Use pluginOptions.nodeIntegration, leave this alone
      // See nklayman.github.io/vue-cli-plugin-electron-builder/guide/security.html#node-integration for more info
      nodeIntegration: true,
      contextIsolation: false,
      webSecurity: false,
      enableRemoteModule: true, // 允许渲染进程使用remote模块
      nodeIntegrationInWorker: true // 在Web工作器中启用了Node集成
      // 允许在子页面(iframe)或子窗口(child window)中集成Node.js
      // nodeIntegrationInSubFrames: true
    }
  })
  // 当主屏窗口关闭时，发送消息给副屏窗口
  // win.on('closed', () => {
  //   // 关闭所有子窗口
  //   secondaryWindow.close();
  //   win = null
  // });
  win.removeMenu()
  createSecondaryWindow()
  createThirdWindow()
  createFourthWindow()
  // win.webContents.openDevTools()
  if (process.env.WEBPACK_DEV_SERVER_URL) {
    // Load the url of the dev server if in development mode
    await win.loadURL(process.env.WEBPACK_DEV_SERVER_URL)
    // if (!process.env.IS_TEST) win.webContents.openDevTools()
  } else {
    createProtocol('app')
    // Load the index.html when not in development
    const indexPath = path.join(__dirname, 'index.html')
    win.loadURL(`file://${indexPath}`)
  }
  // win.webContents.openDevTools()
  ipcMain.on('window-close', function() {
    app.exit()
  })
  ipcMain.on('window-min', function() {
    if (win.isFullScreen()) {
      win.setFullScreen(false)  // 将窗口退出全屏模式
    } else {
      win.setFullScreen(true)
    }
  })

}

function createChildWindow() {
  childWindow = new BrowserWindow({
    parent: win,
    width: 1200,
    height: 900,
    show: false,
    // frame: false,
    fullscreen: true,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: !process.env.ELECTRON_NODE_INTEGRATION,
      webSecurity: false,
      enableRemoteModule: true, // 允许渲染进程使用remote模块
      nodeIntegrationInWorker: true // 在Web工作器中启用了Node集成
    }
  })
  childWindow.removeMenu()
  if (process.env.WEBPACK_DEV_SERVER_URL) {
    childWindow.loadURL(process.env.WEBPACK_DEV_SERVER_URL + '#' + '/sysLogin')
    // if (!process.env.IS_TEST) childWindow.webContents.openDevTools()
  } else {
    childWindow.loadURL(`file://${__dirname}/index.html#/sysLogin`)
    // childWindow.webContents.openDevTools()
  }

  childWindow.on('closed', () => {
    childWindow = null
  })
}

function createSecondaryWindow() {
  const displays = screen.getAllDisplays()
  // 假设你想在第二个屏幕上打开窗口
  const externalDisplay = displays.find((display) => {
    return display.bounds.x !== 0 || display.bounds.y !== 0
  })
  if (externalDisplay) {
    if (secondaryWindow) {
      secondaryWindow.show()
    } else {
      secondaryWindow = new BrowserWindow({
        parent: win,
        x: externalDisplay.bounds.x + 50, // 以第二个屏幕的左上角为原点，向右偏移 50 个像素
        y: externalDisplay.bounds.y + 50, // 以第二个屏幕的左上角为原点，向下偏移 50 个像素
        width: 1200,
        height: 900,
        show: false,
        // frame: false,
        fullscreen: true,
        webPreferences: {
          nodeIntegration: true,
          contextIsolation: !process.env.ELECTRON_NODE_INTEGRATION,
          webSecurity: false,
          enableRemoteModule: true, // 允许渲染进程使用remote模块
          nodeIntegrationInWorker: true // 在Web工作器中启用了Node集成

        }
      })
      secondaryWindow.removeMenu()
      if (process.env.WEBPACK_DEV_SERVER_URL) {
        secondaryWindow.loadURL(process.env.WEBPACK_DEV_SERVER_URL + '#' + '/index2')
        // if (!process.env.IS_TEST) secondaryWindow.webContents.openDevTools()
      } else {
        secondaryWindow.loadURL(`file://${__dirname}/index.html#/index2`)
      }

      secondaryWindow.on('closed', () => {
        secondaryWindow = null
      })
    }
  }
}

function createThirdWindow() {
  const displays = screen.getAllDisplays()
  // 假设你想在第二个屏幕上打开窗口
  const externalDisplay = displays.find((display) => {
    return display.bounds.x !== 0 || display.bounds.y !== 0
  })
  if (externalDisplay) {
    if (thirdWindow) {
      thirdWindow.show()
    } else {
      thirdWindow = new BrowserWindow({
        parent: win,
        x: externalDisplay.bounds.x + 50, // 以第二个屏幕的左上角为原点，向右偏移 50 个像素
        y: externalDisplay.bounds.y + 50, // 以第二个屏幕的左上角为原点，向下偏移 50 个像素
        width: 1200,
        height: 900,
        show: false,
        // frame: false,
        fullscreen: true,
        webPreferences: {
          nodeIntegration: true,
          contextIsolation: !process.env.ELECTRON_NODE_INTEGRATION,
          webSecurity: false,
          enableRemoteModule: true, // 允许渲染进程使用remote模块
          nodeIntegrationInWorker: true // 在Web工作器中启用了Node集成

        }
      })
      thirdWindow.removeMenu()
      if (process.env.WEBPACK_DEV_SERVER_URL) {
        thirdWindow.loadURL(process.env.WEBPACK_DEV_SERVER_URL + '#' + '/identifierStudy')
        // if (!process.env.IS_TEST) thirdWindow.webContents.openDevTools()
      } else {
        thirdWindow.loadURL(`file://${__dirname}/index.html#/identifierStudy`)
      }
      thirdWindow.on('closed', () => {
        thirdWindow = null
      })
    }

  }
}

function createFourthWindow() {
  const displays = screen.getAllDisplays()
  // 假设你想在第二个屏幕上打开窗口
  const externalDisplay = displays.find((display) => {
    return display.bounds.x !== 0 || display.bounds.y !== 0
  })
  if (externalDisplay) {
    if (fourthWindow) {
      fourthWindow.show()
    } else {
      fourthWindow = new BrowserWindow({
        parent: win,
        x: externalDisplay.bounds.x + 50, // 以第二个屏幕的左上角为原点，向右偏移 50 个像素
        y: externalDisplay.bounds.y + 50, // 以第二个屏幕的左上角为原点，向下偏移 50 个像素
        width: 1200,
        height: 900,
        show: false,
        // frame: false,
        fullscreen: true,
        webPreferences: {
          nodeIntegration: true,
          contextIsolation: !process.env.ELECTRON_NODE_INTEGRATION,
          webSecurity: false,
          enableRemoteModule: true, // 允许渲染进程使用remote模块
          nodeIntegrationInWorker: true // 在Web工作器中启用了Node集成
        }
      })
      fourthWindow.removeMenu()
      if (process.env.WEBPACK_DEV_SERVER_URL) {
        fourthWindow.loadURL(process.env.WEBPACK_DEV_SERVER_URL + '#' + '/identifierExam2')
        // if (!process.env.IS_TEST) fourthWindow.webContents.openDevTools()
      } else {
        fourthWindow.loadURL(`file://${__dirname}/index.html#/identifierExam2`)
      }

      fourthWindow.on('closed', () => {
        fourthWindow = null
      })
    }

  }
}

ipcMain.on('thirdWindowSend_data', (event, message) => {
  console.log(message, '1')
  // 主进程向渲染进程触发事件
  if (thirdWindow) {
    console.log('secondaryWindow')
    thirdWindow.webContents.send('get_thirdWindowData', message)
  }

})
ipcMain.on('fourthWindowSend_data', (event, message) => {
  console.log(message, '1')
  // 主进程向渲染进程触发事件
  if (fourthWindow) {
    console.log('secondaryWindow')
    fourthWindow.webContents.send('get_fourthWindowData', message)
  }

})
ipcMain.on('window-open', function(event, message) {
  if (secondaryWindow) {
    secondaryWindow.show()
  }
  if (thirdWindow) {
    thirdWindow.hide()
  }

})
ipcMain.on('window-open2', function(event, message) {
  console.log(message)
  if (secondaryWindow) {
    secondaryWindow.hide()
  }

  if (thirdWindow) {
    thirdWindow.show()
    thirdWindow.webContents.send('thirdWindow-data', message)
  }

})
ipcMain.on('window-open3', function(event, message) {
  console.log(message)
  if (secondaryWindow) {
    secondaryWindow.hide()
  }
  if (thirdWindow) {
    thirdWindow.hide()
  }
  if (fourthWindow) {
    fourthWindow.show()
    fourthWindow.webContents.send('fourthWindow-data', message)
  }

})
ipcMain.on('secondaryWindow-close', (event, message) => {
  if (secondaryWindow) {
    secondaryWindow.hide()
  }
})
ipcMain.on('thirdWindow-close', (event, message) => {
  if (thirdWindow) {
    thirdWindow.hide()
    if (secondaryWindow) {
      secondaryWindow.show()
    }
  }
})
ipcMain.on('get_activate_data', (event, message) => {
  const client = new net.Socket()
  client.connect(9001, '127.0.0.1', () => {
    console.log('已连接到服务器')
    console.log(message)
    client.write(message)
  })

  client.on('data', (data) => {
    console.log('从服务器收到数据：' + data)
    win.webContents.send('send_activate_data', data)
    // win.webContents.send('send_registerCode_data', data)
    client.destroy() // 关闭连接
    // client.write('activation&' + data);
  })
  client.on('close', () => {
    console.log('连接已关闭')
  })

})
ipcMain.on('get_registerCode_data', (event, message) => {
  const client = new net.Socket()
  client.connect(9001, '127.0.0.1', () => {
    console.log('已连接到服务器')
    console.log(message)
    client.write(message)
  })

  client.on('data', (data) => {
    console.log('从服务器收到数据：' + data)
    win.webContents.send('send_registerCode_data', data)
    client.destroy() // 关闭连接
    // client.write('activation&' + data);
  })
  client.on('close', () => {
    console.log('连接已关闭')
  })

})

// 监听渲染进程发送的请求关闭窗口的消息
ipcMain.on('close-window-request', () => {
  app.quit()
})
ipcMain.on('go-to-sys', () => {
  if (childWindow.isVisible()) {
    childWindow.hide()
  } else {
    childWindow.show()
  }
})
// Quit when all windows are closed.
app.on('window-all-closed', () => {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  win = null
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('before-quit', async(event) => {
  if (win) {
    win.webContents.send('before-quit', '应用即将退出，请执行清理操作')
  }
})
app.on('will-quit', () => {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  // win.send('window-min')
})
app.on('activate', () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) createWindow()
})

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', async() => {
  // if (isDevelopment && !process.env.IS_TEST) {
  //   // Install Vue Devtools
  //   try {
  //     await installExtension(VUEJS_DEVTOOLS)
  //   } catch (e) {
  //     console.error('Vue Devtools failed to install:', e.toString())
  //   }
  // }
  createWindow()
  createChildWindow()
  session.defaultSession.webRequest.onBeforeSendHeaders((details, callback) => {
    details.requestHeaders['SomeHeader'] = 'some value'
    callback({ cancel: false, requestHeaders: details.requestHeaders })
  })
})
app.on('close', async() => {
})
// Exit cleanly on request from parent process in development mode.
if (isDevelopment) {
  if (process.platform === 'win32') {
    process.on('message', (data) => {
      if (data === 'graceful-exit') {
        app.quit()
      }
    })
  } else {
    process.on('SIGTERM', () => {
      app.quit()
    })
  }
}
