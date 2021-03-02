const { Client } = require('tdl');
const { TDLib } = require('tdl-tdlib-addon');

const client = new Client(new TDLib(), {
  apiId: 3166337, // Your api_id
  apiHash: '28b23f0714e5d6a6df43df3690927515', // Your api_hash
});

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

module.exports = { client, getChatInfo, forwardMessage };
