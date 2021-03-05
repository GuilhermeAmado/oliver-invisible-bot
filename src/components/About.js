import React, { useContext } from 'react';
import { Dialog } from '@blueprintjs/core';
import { GlobalContext } from '../GlobalContext';

const About = () => {
  const { isAboutOpen, setIsAboutOpen } = useContext(GlobalContext);
  function handleCloseAbout() {
    setIsAboutOpen(false);
  }
  return (
    <>
      <Dialog
        className="bp3-dark"
        title="Sobre o Oliver Telegram Bot"
        isOpen={isAboutOpen}
        onClose={handleCloseAbout}
      >
        <div class="bp3-dialog-body about-body">
          O Oliver é um bot de encaminhamento de mensagens "invisível" para o
          Telegram, ou seja, é um bot que não necessita estar em um chat ou
          grupo para que possa ler as mensagens. Você não precisa adicionar o
          Oliver em nenhuma conversa, canal ou grupo para iniciar o
          monitoramento e encaminhamento de mensagens. Basta que a sua conta do
          Telegram tenha acesso aos chats, grupos ou canais que deseja
          monitorar.
        </div>
      </Dialog>
    </>
  );
};

export default About;
