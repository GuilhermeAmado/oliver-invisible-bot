const { Client } = require('tdl');
const { TDLib } = require('tdl-tdlib-addon');
const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const util = require('util');
const isDev = require('electron-is-dev');
const {
  client,
  connectTelegram,
  loginTelegram,
  forwardMessage,
} = require('./tdl/client');
const {
  default: installExtension,
  REACT_DEVELOPER_TOOLS,
} = require('electron-devtools-installer');

let chatIdArray = [];
let chatIdToForwardTo = null;

async function getChatList() {
  return new Promise(async (resolve, reject) => {
    const { chat_ids } = await client.invoke({
      _: 'getChats',
      offset_order: '9223372036854775807',
      offset_chat_id: 0,
      limit: 100,
    });
    const chats = [];
    for (const chatId of chat_ids) {
      const chat = await client.invoke({
        _: 'getChat',
        chat_id: chatId,
      });
      chats.push({
        id: chat.id,
        type: chat.type._,
        title: chat.title,
        permissions: chat.permissions,
      });
    }
    resolve(chats);
  });
}

// CREATE MAIN WINDOW AND CONNECT TO TELEGRAM
function createWindow() {
  const win = new BrowserWindow({
    width: 720,
    height: 720,
    webPreferences: {
      nodeIntegration: true,
    },
  });

  win.loadURL(
    isDev
      ? 'http://localhost:3000/'
      : `file://${path.join(__dirname, '../build/index.html')}`
  );

  win.webContents.on('did-finish-load', async () => {
    connectTelegram()
      .then(() => console.log('CONECTADO!'))
      .catch((err) => console.log(err));
    client.on('auth-needed', () => {
      win.webContents.send('auth:needed');
    });
    loginTelegram()
      .then(async () => {
        const allChats = await getChatList().then((chats) => chats);
        win.webContents.send('got:chats', { contents: allChats });
      })
      .catch((err) => console.log(err));
  });

  ipcMain.on('start:monitor', (event, args) => {
    console.log('RECEBI COMANDO PARA MONITORAR!');
    chatIdArray = [];
    chatIdToForwardTo = null;
    args.chatsToMonitor.forEach((chat) => chatIdArray.push(chat.value));
    chatIdToForwardTo = args.chatToForwardTo.value;
    console.log(args);
    console.log(chatIdArray);
    console.log(chatIdToForwardTo);
    if (chatIdToForwardTo && chatIdArray.length > 0) {
      console.log('tem id e array é maior que zero');
      event.reply('started:monitoring', {
        intent: 'primary',
        message: 'Monitoramento iniciado',
        icon: 'tick-circle',
      });
    }
    if (chatIdArray.includes(chatIdToForwardTo)) {
      event.reply('stopped:monitoring', {
        intent: 'danger',
        message: 'O grupo que recebe as mensagens não pode ser monitorado',
        icon: 'error',
      });
    }
  });

  ipcMain.on('stop:monitor', (event, args) => {
    console.log('Recebi o comando para PARAR de monitorar! 🤚🛑');
    chatIdArray = [];
    chatIdToForwardTo = null;
    event.reply('stopped:monitoring', {
      intent: 'warning',
      message: 'Monitoramento parado!',
      icon: 'warning-sign',
    });
  });

  client.on('error', console.error);

  client.on('update', (update) => {
    const id = update?.message?.chat_id;
    if (
      chatIdToForwardTo &&
      chatIdArray.includes(id) &&
      update._ === 'updateNewMessage'
    ) {
      // console.log('______UPDATE', util.inspect(update, false, null, true));
      forwardMessage(chatIdToForwardTo, id, update.message.id);
      win.webContents.send('update', {
        intent: 'success',
        message: 'Mensagem encaminhada com sucesso',
        icon: 'redo',
      });
    }
  });
}

app.whenReady().then(() => {
  createWindow();
  isDev &&
    installExtension(REACT_DEVELOPER_TOOLS)
      .then((name) => console.log(`Added Extension:  ${name}`))
      .catch((err) => console.log('An error occurred: ', err));
});

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

// TDL
