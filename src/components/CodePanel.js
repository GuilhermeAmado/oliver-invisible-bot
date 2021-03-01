import React, { useEffect, useState } from 'react';
import { Classes, Spinner, InputGroup } from '@blueprintjs/core';
import 'fs';
import { ipcRenderer } from 'electron';

const CodePanel = ({ phone }) => {
  const [isPending, setIsPending] = useState(true);
  useEffect(() => {
    console.log('enviando para o back-end isso: ', phone);
    ipcRenderer.send('phone:submitted', {
      contents: phone,
    });
    return () => {
      console.log('cleanup function here');
    };
  }, []);
  return (
    <div className={Classes.DIALOG_BODY}>
      <p>Em instantes você receberá um código de autenticação</p>
      {isPending && <Spinner />}
      <InputGroup large="true" leftIcon="lock" />
    </div>
  );
};

export default CodePanel;
