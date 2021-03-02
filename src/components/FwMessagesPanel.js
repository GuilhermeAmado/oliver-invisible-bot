import React, { useState, useEffect } from 'react';
import { ipcRenderer } from 'electron';
import { Spinner, Callout } from '@blueprintjs/core';

const FwMessagesPanel = () => {
  const [isPending, setIsPending] = useState(true);
  const [chatList, setChatList] = useState([]);
  useEffect(() => {
    ipcRenderer.on('got:chats', (event, props) => {
      console.log('HEEEYY I got the chats');
      console.log(props.contents);
      setChatList(props.contents);
      setIsPending(false);
    });
  }, []);
  return (
    <>
      {chatList.length > 0 && isPending ? (
        <Spinner />
      ) : (
        <>
          <h2>Encaminhar Mensagens</h2>
          <Callout
            title={`Você tem ${chatList.length} chats iniciados`}
            intent="warning"
          >
            Só é possível monitorar chats que já tenham sido iniciados.
          </Callout>
          <h3>Selecione quais chats deseja monitorar:</h3>
        </>
      )}
    </>
  );
};

export default FwMessagesPanel;
