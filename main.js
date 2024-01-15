const { app, BrowserWindow, Menu, dialog, ipcMain } = require('electron');
const fs = require('fs');
const path = require('path');
let win, winSplash;

Menu.setApplicationMenu(false);

const createWindowSplash = () => {
  winSplash = new BrowserWindow({
    width: 450,
    height: 450,
    frame:false,
    center:true,
    transparent:true,
    alwaysOnTop: true,
    title: "Canvas Image Edit",
    icon: __dirname + "/src/img/logo.png",
  })

  // Defina a janela para sempre no topo temporariamente
  winSplash.setAlwaysOnTop(true);
  
  winSplash.loadFile('src/splash.html');
  winSplash.once('ready-to-show', () => {
    setTimeout(()=>{
      createWindow();
      winSplash.close();
    },1000);
  })
}

app.whenReady().then(() => {
  createWindowSplash();
})

function createWindow() {
  win = new BrowserWindow({
    width: 800,
    height: 600,
    title: "Canvas Image Edit",
    icon: __dirname + "/src/img/logo.png",
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      enableRemoteModule: true
    }
  });

  win.loadFile('src/index.html');
  win.maximize();
  //win.webContents.openDevTools();

  // Quando a janela está pronta para ser exibida
  win.once('ready-to-show', () => {
    // Mostre a janela
      win.show();
  });

  // Adicione o manipulador de eventos 'close' para confirmar o fechamento
  win.on('close', (event) => {
    const choice = dialog.showMessageBoxSync(win, {
      type: 'question',
      buttons: ['yes', 'No'],
      defaultId: 1, // Índice do botão padrão (0 ou 1)
      title: 'Confirmação de Fechamento',
      message: 'Você tem certeza que deseja fechar a aplicação?'
    });

    if (choice === 1) {
      // Se o usuário escolher "Não", impedir o fechamento da janela
      event.preventDefault();
    }
    // Se o usuário escolher "Sim", a aplicação será fechada
    win.webContents.session.clearStorageData()
  });
}

ipcMain.on('salvar-arquivo', (event, data) => {
  fs.writeFileSync('url.txt', data);
});

ipcMain.on('ler-arquivo', (event, caminhoArquivo) => {
  // Caminho do arquivo
  const caminhoCompleto = path.join(__dirname, caminhoArquivo);

  // Lê o conteúdo do arquivo
  fs.readFile(caminhoCompleto, 'utf-8', (err, data) => {
    if (err) {
      event.reply('ler-arquivo-resposta', { erro: true, mensagem: err.message });
    } else {
      event.reply('ler-arquivo-resposta', { erro: false, conteudo: data });
    }
  });
});
