import React, { useEffect } from 'react';
import { Classes, InputGroup } from '@blueprintjs/core';
import 'fs';
import { ipcRenderer } from 'electron';

const CodePanel = (props) => {
  const [code, setCode] = props.setCode;
  useEffect(() => {
    ipcRenderer.send('phone:submitted', {
      contents: props.phone,
    });
  }, []); //eslint-disable-line
  return (
    <div className={Classes.DIALOG_BODY}>
      <p>
        Em instantes você receberá um código de autenticação no telefone:{' '}
        {props.phone}
      </p>
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
