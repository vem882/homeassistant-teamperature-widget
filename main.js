const { app, BrowserWindow, ipcMain } = require('electron')
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

  win.loadFile('index.html')
  //win.webContents.openDevTools()
}

app.whenReady().then(createWindow)