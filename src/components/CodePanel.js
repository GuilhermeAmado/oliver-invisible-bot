import React, { useEffect, useState } from 'react';
import { Classes, Spinner, InputGroup } from '@blueprintjs/core';
import 'fs';
import { ipcRenderer } from 'electron';

const CodePanel = (props) => {
  const [isPending, setIsPending] = useState(true);
  const [code, setCode] = props.setCode;
  useEffect(() => {
    console.log('enviando para o back-end isso: ', props.phone);
    ipcRenderer.send('phone:submitted', {
      contents: props.phone,
    });
    return () => {
      console.log('cleanup function here');
    };
  }, []); //eslint-disable-line
  return (
    <div className={Classes.DIALOG_BODY}>
      <p>Em instantes você receberá um código de autenticação</p>
      {isPending && <Spinner />}
      <InputGroup
        large="true"
        leftIcon="lock"
        value={code}
        onChange={(e) => setCode(e.target.value)}
        maxLength="5"
      />
    </div>
  );
};

export default CodePanel;
