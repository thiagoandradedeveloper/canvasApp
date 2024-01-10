const { app, BrowserWindow, Menu, dialog, ipcMain } = require('electron');
const fs = require('fs');
const path = require('path');

Menu.setApplicationMenu(false);

function createWindow() {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    icon: __dirname + "/src/img/logo.png",
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      enableRemoteModule: true
    },
    title: "CanvasApp"
  });

  win.loadFile('src/index.html');
  win.maximize();
  win.webContents.openDevTools();

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

// Se necessário, você pode adicionar lógica de limpeza ou salvamento antes de sair
app.on('before-quit', () => {
  // Adicione qualquer lógica de limpeza ou salvamento aqui, se necessário
});

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