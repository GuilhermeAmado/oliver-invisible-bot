import React, { useState, useEffect, useContext } from 'react';
import { ipcRenderer } from 'electron';
import { Spinner, Callout } from '@blueprintjs/core';
import ChatSelect from './ChatSelect';
import { GlobalContext } from '../GlobalContext';

const FwMessagesPanel = () => {
  const [isPending, setIsPending] = useState(true);
  const [
    allChats,
    setAllChats,
    chatsToMonitor,
    setChatsToMonitor,
    chatToForwardTo,
    setChatToForwardTo,
  ] = useContext(GlobalContext);
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
      // setChatsToMonitor(chatList);
      setIsPending(false);
    });
  }, []);
  // const chats = chatList.map((chat) => {
  //   return {
  //     value: chat.id,
  //     label: chat.title,
  //   };
  // });
  return (
    <>
      {allChats.length > 0 && isPending ? (
        <Spinner />
      ) : (
        <>
          <h2>Encaminhar Mensagens</h2>
          <Callout
            title={`Você tem ${allChats.length} chats iniciados`}
            intent="warning"
          >
            Só é possível monitorar chats que já tenham sido iniciados.
          </Callout>
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
        </>
      )}
    </>
  );
};

export default FwMessagesPanel;
