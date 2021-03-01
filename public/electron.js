const { Client } = require('tdl');
const { TDLib } = require('tdl-tdlib-addon');
const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const os = require('os');
const {
  default: installExtension,
  REACT_DEVELOPER_TOOLS,
} = require('electron-devtools-installer');
const isDev = require('electron-is-dev');
const { ipcRenderer } = require('electron/renderer');

const client = new Client(new TDLib(), {
  apiId: 3166337, // Your api_id
  apiHash: '28b23f0714e5d6a6df43df3690927515', // Your api_hash
});

// CREATE MAIN WINDOW AND CONNECT TO TELEGRAM
function createWindow() {
  const win = new BrowserWindow({
    width: 800,
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
    win.webContents.send('ping', '🤘');
    win.webContents.send('open:dialog');
  });

  async function connectTelegram() {
    await client.connect();
    await client.login(() => ({
      type: 'user',
      getPhoneNumber: (retry) => {
        return new Promise((resolve, reject) => {
          if (retry) reject('Invalid phone number');
          ipcMain.once('phone:submitted', (event, arg) => {
            resolve(arg.contents);
          });
          // ipcMain.removeAllListeners();
        });
      },
      // getAuthCode: (retry) => {
      //   return new Promise((resolve, reject) => {
      //     if (retry) reject('Invalid code');
      //     ipcMain.once('code:submitted', (event, arg) => {
      //       resolve(arg.contents);
      //     });
      //   });
      // },
    }));
  }

  connectTelegram();
}

app.whenReady().then(() => {
  createWindow();
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
client.on('error', console.error);

// ipcMain.once('phone:submitted', (event, arg) => {
//   console.log('RECEIVED PHONE: ', arg.contents);
// });
// ipcMain.once('code:submitted', (event, arg) => {
//   console.log('RECEIVED CODE: ', arg.contents);
// });
