import React, { useState, useEffect, useContext } from 'react';
import { ipcRenderer } from 'electron';
import { Spinner, Callout, Button } from '@blueprintjs/core';
import ChatSelect from './ChatSelect';
import { GlobalContext } from '../GlobalContext';

const FwMessagesPanel = () => {
  const [isPending, setIsPending] = useState(true);
  const {
    allChats,
    setAllChats,
    chatsToMonitor,
    setChatsToMonitor,
    chatToForwardTo,
    setChatToForwardTo,
    isMonitoring,
    connected,
    setIsConnected,
  } = useContext(GlobalContext);

  useEffect(() => {
    ipcRenderer.send('get:auth-state');
    ipcRenderer.on('got:auth-state', (event, props) => {
      if (props._ === 'authorizationStateReady') {
        setIsConnected(true);
      } else {
        setIsConnected(false);
      }
    });
    ipcRenderer.on('got:chats', (event, props) => {
      console.log('HEEEYY I got the chats');
      console.log(props.contents);
      setAllChats(
        props.contents.map((chat) => {
          return {
            value: chat.id,
            label: chat.title,
            can_send_messages: chat.permissions.can_send_messages,
          };
        })
      );
      setIsPending(false);
    });
  }, []); //eslint-disable-line

  function handleClickIniciar() {
    ipcRenderer.send('start:monitor', {
      chatsToMonitor,
      chatToForwardTo,
    });
  }
  function handleClickParar() {
    ipcRenderer.send('stop:monitor');
  }
  return (
    <>
      {allChats.length > 0 && isPending ? (
        <Spinner />
      ) : (
        <>
          <h2>Encaminhar Mensagens</h2>
          {!connected ? (
            <Callout title={'Bot desconectado'} intent="danger">
              Sua conta não está conectada.
              <br />
              Para se conectar, clique em Configurações &gt; Conectar ao
              Telegram
            </Callout>
          ) : !isMonitoring ? (
            <Callout title={'Monitoramento Parado'} intent="warning">
              Você tem {allChats.length} chats iniciados.
              <br />
              Só é possível monitorar chats que já tenham sido iniciados.
            </Callout>
          ) : (
            <Callout
              title={`Monitorando ${chatsToMonitor.length} ${
                chatsToMonitor.length === 1 ? 'chat' : 'chats'
              }`}
              intent="primary"
            >
              Todas mensagens estão sendo enviadas para o chat:&nbsp;
              <span className="bp3-tag">{chatToForwardTo.label}</span>
            </Callout>
          )}
          <h3>Selecione quais chats deseja monitorar:</h3>
          <ChatSelect options={allChats} isMulti onChange={setChatsToMonitor} />
          <br />
          <h3>Selecione o chat que deve receber as mensagens:</h3>
          <ChatSelect
            options={allChats.filter(
              (chat) =>
                chat.can_send_messages &&
                !chatsToMonitor.find(({ value }) => chat.value === value)
            )}
            onChange={setChatToForwardTo}
          />
          <br />
          <Button
            text={!isMonitoring ? 'Iniciar' : 'Monitorando...'}
            fill
            intent="primary"
            onClick={handleClickIniciar}
            disabled={
              chatToForwardTo.length === 0 ||
              chatsToMonitor.length === 0 ||
              isMonitoring
            }
          />
          <br />
          <Button
            text="Parar"
            fill
            onClick={handleClickParar}
            disabled={!isMonitoring}
          />
        </>
      )}
    </>
  );
};

export default FwMessagesPanel;
