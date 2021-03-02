import React, { useState, useContext } from 'react';
import Select from 'react-select';
import { GlobalContext } from '../GlobalContext';

const ChatSelect = (props) => {
  const [
    allChats,
    setAllChats,
    chatsToMonitor,
    setChatsToMonitor,
    chatToForwardTo,
    setChatToForwardTo,
  ] = useContext(GlobalContext);
  return (
    <Select
      {...props}
      maxMenuHeight="200px"
      options={props.options}
      noOptionsMessage={() => 'Não foi encontrado nenhum chat :('}
      className="react-select-container"
      classNamePrefix="react-select"
      placeholder="Selecione ou digite o nome do chat..."
      onChange={props.onChange}
      theme={(theme) => ({
        ...theme,
        fontFamily: 'inherit',
        borderRadius: 3,
        colors: {
          ...theme.colors,
          primary25: 'rgba(16, 22, 26, 0.3)',
          primary: 'rgba(125, 188, 255, 0.6)',
          neutral80: 'white',
          neutral10: '#0F9960',
          neutral0: '#293742',
        },
      })}
    />
  );
};

export default ChatSelect;
