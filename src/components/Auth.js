import { ipcRenderer } from 'electron';
import React, { useState, useEffect, useContext } from 'react';
import {
  Dialog,
  MultistepDialog,
  DialogStep,
  Button,
  Classes,
  AnchorButton,
  Intent,
} from '@blueprintjs/core';
import PhonePanel from './PhonePanel';
import CodePanel from './CodePanel';
import { GlobalContext } from '../GlobalContext';

const Auth = () => {
  const { showAuthDialog, setShowAuthDialog } = useContext(GlobalContext);
  const [isOpen, setIsOpen] = useState(false);
  const [phone, setPhone] = useState('');
  const [code, setCode] = useState('');
  const handleOpen = () => setIsOpen(true);
  const handleClose = () => setShowAuthDialog(false);
  const handleClick = () => {
    handleClose();
    ipcRenderer.send('code:submitted', {
      contents: code,
    });
    ipcRenderer.send('get:auth-state');
  };

  useEffect(() => {
    ipcRenderer.once('auth:needed', () => {
      setShowAuthDialog(true);
    });
  }, []); //eslint-disable-line

  return (
    <>
      {/*<Button onClick={handleOpen}>Show dialog</Button>*/}
      <MultistepDialog
        icon="info-sign"
        title="Autenticação da sua conta Telegram"
        onClose={handleClose}
        isOpen={showAuthDialog}
        className="container bp3-dark"
        nextButtonProps={{
          text: 'Próximo',
          disabled: phone === '' || phone.length < 13,
        }}
        finalButtonProps={{
          text: 'Conectar',
          disabled: code === '' || code.length < 5,
          onClick: handleClick,
        }}
      >
        <DialogStep
          id="enter-phone"
          title="Telefone"
          panel={<PhonePanel setPhone={[phone, setPhone]} />}
        />
        <DialogStep
          id="enter-code"
          title="Código Login"
          panel={<CodePanel phone={phone} setCode={[code, setCode]} />}
        />
      </MultistepDialog>
    </>
  );
};

export default Auth;
