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
const client = new Client(new TDLib(), {
  apiId: 3166337, // Your api_id
  apiHash: '28b23f0714e5d6a6df43df3690927515', // Your api_hash
});

client.on('error', console.error);

async function connectTelegram(phone, code) {
  client.connectAndLogin(() => ({
    getPhoneNumber: () =>
      new Promise((resolve, reject) => {
        resolve(phone);
        reject(new TypeError('Invalid phone number'));
      }),
    // getAuthCode: () => {
    //   let code;
    //   ipcMain.once('code:submitted', (event, arg) => {
    //     console.log(arg.contents);
    //   });
    //   return new Promise((resolve, reject) => {
    //     resolve('');
    //   });
    // },
  }));
}

ipcMain.once('phone:submitted', (event, arg) => {
  console.log('RECEIVED phone:submitted!!!!!!!!!!!!!!!!!!!');
  connectTelegram(arg.contents);
});
ipcMain.on('code:submitted', (event, arg) => {
  console.log('Recebi: ', arg.contents);
});
