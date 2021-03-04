const { Client } = require('tdl');
const { TDLib } = require('tdl-tdlib-addon');
const { ipcMain } = require('electron');

const client = new Client(new TDLib(), {
  apiId: 3166337, // Your api_id
  apiHash: '28b23f0714e5d6a6df43df3690927515', // Your api_hash
});

async function connectTelegram() {
  await client.connect();
}

async function loginTelegram() {
  await client.login(() => ({
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
}

// Invocations, returns promise
async function getChatInfo(id) {
  const chat = await client.invoke({
    _: 'getChat',
    chat_id: id,
  });
  return chat;
}

async function forwardMessage(chatTo, chatFrom, messageId) {
  console.log('Mensagem encaminhada');
  return await client.invoke({
    _: 'forwardMessages',
    chat_id: chatTo,
    from_chat_id: chatFrom,
    message_ids: [messageId],
  });
}

module.exports = {
  client,
  connectTelegram,
  loginTelegram,
  getChatInfo,
  forwardMessage,
};
