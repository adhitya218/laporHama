const {app,BrowserWindow,Menu} = require('electron')
const path = require('path')
const url = require('url')
const shell = require('electron').shell
const FormData = require('FormData');
const axios = require('axios');
const ipc = require('electron').ipcMain
require('dotenv').config()
const ghissues     = require('ghissues')
    , authOptions = { user: process.env.USERNAME, token: process.env.USER_TOKEN }

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let win

function createWindow() {
  // Create the browser window.
  win = new BrowserWindow({
    width: 600,
    height: 500,
    resizable: false
  })

  // and load the index.html of the app.
  win.loadURL(url.format({
    pathname: path.join(__dirname, 'src/index.html'),
    protocol: 'file:',
    slashes: true
  }))
   // Open the DevTools.
  if(process.env.NODE_ENV == 'development'){
    win.webContents.openDevTools()
  }else{
    win.webContents.on("devtools-opened", () => { win.webContents.closeDevTools(); });
  }

  // Emitted when the window is closed.
  win.on('closed', () => {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    win = null
  })
  // const menu = Menu.buildFromTemplate([{
  //   label: 'Menu',
  //   submenu: [{
  //       label: 'Adjust Notification Value'
  //     },
  //     {
  //       label: 'CoinMarketCap',
  //       click() {
  //         shell.openExternal('http://github.com')
  //       }
  //     },
  //     {
  //       label: 'Exit',
  //       click() {
  //         app.quit()
  //       }
  //     },
  //   ]
  // }])
  Menu.setApplicationMenu(null)
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow)

// Quit when all windows are closed.
app.on('window-all-closed', () => {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (win === null) {
    createWindow()
  }
})
ipc.on('send-bug', function(event, payload) {
  let data={
    title: payload.title,
    body: payload.body+'![laporHama-'+payload.image+']('+payload.image+')'
  }
    ghissues.create(authOptions, process.env.USERNAME, process.env.REPO, data, function(err, issue) {
      if (err) {
        console.log(err);
      } else {
        console.log(issue)
      }
    })

})
