const { app, BrowserWindow, Menu } = require('electron');
Menu.setApplicationMenu(false);
function createWindow() {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    icon: __dirname + "/src/img/logo.png",
    webPreferences: {
      nodeIntegration: true
    },
    title:"CanvasApp"
  });

  win.loadFile('src/index.html');
  win.maximize();
  //win.webContents.session.clearStorageData();
  //win.WebContents.session.cookies.remove();
  //win.webContents.clearHistory();
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});
