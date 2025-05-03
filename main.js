const { app, BrowserWindow, ipcMain } = require('electron')
let configWin = null
ipcMain.on('move-window', (event, pos) => {
    const win = BrowserWindow.getFocusedWindow()
    win.setPosition(pos[0], pos[1])
})
function createWindow() {
  const win = new BrowserWindow({
    width: 100,
    height: 55,
    alwaysOnTop: true,
    frame: false,
    transparent: true,
    webPreferences: {
      preload: require('path').join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false, 
      enableRemoteModule: false,
      sandbox: false 
    }
  })
  function openConfigWindow() {
    if (configWin) {
      configWin.focus()
      return
    }
    configWin = new BrowserWindow({
      width: 490,
      height: 520,
      resizable: false,
      modal: true,
      parent: BrowserWindow.getFocusedWindow(),
      frame: false,
      webPreferences: {
        preload: require('path').join(__dirname, 'preload.js'),
        contextIsolation: true,
        nodeIntegration: false,
        enableRemoteModule: false,
        sandbox: false
      }
    })
    configWin.loadFile('config.html')
    configWin.on('closed', () => { configWin = null })
  }
  ipcMain.on('open-config-window', openConfigWindow)  
  win.loadFile('index.html')
  //win.webContents.openDevTools()
}

app.whenReady().then(createWindow)