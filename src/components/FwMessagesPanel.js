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
    setIsMonitoring,
  } = useContext(GlobalContext);

  useEffect(() => {
    ipcRenderer.on('got:chats', (event, props) => {
      console.log('HEEEYY I got the chats');
      console.log(props.contents);
      setAllChats(
        props.contents.map((chat) => {
          return {
            value: chat.id,
            label: chat.title,
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
  console.log(chatToForwardTo.length > 0);
  return (
    <>
      {allChats.length > 0 && isPending ? (
        <Spinner />
      ) : (
        <>
          <h2>Encaminhar Mensagens</h2>
          {!isMonitoring ? (
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
