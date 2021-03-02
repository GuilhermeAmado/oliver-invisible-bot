const { Client } = require('tdl');
const { TDLib } = require('tdl-tdlib-addon');
const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const util = require('util');
const isDev = require('electron-is-dev');
const { client, getChatInfo, forwardMessage } = require('../src/tdl/client');
const {
  default: installExtension,
  REACT_DEVELOPER_TOOLS,
} = require('electron-devtools-installer');

// CREATE MAIN WINDOW AND CONNECT TO TELEGRAM
function createWindow() {
  const win = new BrowserWindow({
    width: 900,
    height: 600,
    webPreferences: {
      nodeIntegration: true,
    },
  });

  win.loadURL(
    isDev
      ? 'http://localhost:3000/'
      : `file://${path.join(__dirname, '../build/index.html')}`
  );

  win.webContents.on('did-finish-load', () => {
    if (client._authNeeded) {
      win.webContents.send('open:dialog');
    } else {
      win.webContents.send('open:toast', {
        intent: 'success',
        message: 'Conectado ao Telegram!',
      });
    }
  });

  async function connectTelegram() {
    await client.connectAndLogin(() => ({
      getPhoneNumber: () => {
        return new Promise((resolve, reject) => {
          ipcMain.once('phone:submitted', (event, arg) => {
            resolve(arg.contents);
          });
        });
      },
      getAuthCode: () => {
        return new Promise((resolve, reject) => {
          ipcMain.once('code:submitted', (event, arg) => {
            resolve(arg.contents);
          });
        });
      },
    }));

    client.on('error', console.error);

    // client.on('update', (update) => {
    //   console.log('______UPDATE', util.inspect(update, false, null, true));
    // });
  }

  connectTelegram();

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

  ipcMain.on('get:chats', async (event, arg) => {
    console.log('HEYY ⚡ Front end want the chats!!');
    const allChats = await getChatList().then((chats) => chats);
    event.reply('got:chats', { contents: allChats });
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
