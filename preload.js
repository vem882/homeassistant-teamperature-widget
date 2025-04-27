const { contextBridge, ipcRenderer } = require('electron')
const fs = require('fs')
const path = require('path')

const configPath = path.join(__dirname, 'config.json')
let config = null
let configMissing = false

try {
    if (fs.existsSync(configPath)) {
        config = JSON.parse(fs.readFileSync(configPath, 'utf8'))
    } else {
        configMissing = true
    }
} catch (e) {
    config = null
    configMissing = true
}

contextBridge.exposeInMainWorld('electronAPI', {
    moveWindow: (pos) => ipcRenderer.sendSync('move-window', pos),
    config: config,
    configMissing: configMissing,
    saveConfig: (newConfig) => {
        fs.writeFileSync(configPath, JSON.stringify(newConfig, null, 2), 'utf8')
    }
})