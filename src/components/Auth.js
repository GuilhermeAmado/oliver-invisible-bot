import React, { useState } from 'react';
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

const Auth = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [phone, setPhone] = useState('');
  const handleOpen = () => setIsOpen(true);
  const handleClose = () => setIsOpen(false);
  const handleClick = () => {
    console.log('CLICKED');
    handleClose();
  };

  return (
    <>
      <Button onClick={handleOpen}>Show dialog</Button>
      <MultistepDialog
        icon="info-sign"
        title="Autenticação da sua conta Telegram"
        onClose={handleClose}
        isOpen={isOpen}
        className="container bp3-dark"
        nextButtonProps={{
          text: 'Próximo',
        }}
        finalButtonProps={{
          text: 'Conectar',
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
          panel={<CodePanel phone={phone} />}
        />
      </MultistepDialog>
    </>
  );
};

export default Auth;
