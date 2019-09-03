const { app, BrowserWindow, ipcMain } = require('electron')
const path = require("path")
const url = require('url')
const systemHandler = require('./systemHandler');


function createWindow() {
    let win = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            nodeIntegration: true,
            devTools: true
        }
    })
    
    win.loadURL(
        url.format({
          pathname: path.join(__dirname, `../dist/foxbat/index.html`),
          protocol: "file:",
          slashes: true
        })
      );

    win.webContents.openDevTools()

  win.on('closed', () => {
    win = null
  })

}

app.on('ready', createWindow);
 ////////////////////////////////////////


ipcMain.on('get-system-files', (event, arg) => {
  console.log("finding files");
  let data = systemHandler.findFiles();
  event.reply('return-system-files', data)
})

ipcMain.on('get-preview', async (event, filePath) => {

  try {
    let buffer = await systemHandler.getPreview(filePath)
    
    event.reply('return-preview', buffer)
  } catch (error) {
    console.log(error)
  }

  
})