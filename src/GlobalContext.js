import React, { useState, createContext } from 'react';

export const GlobalContext = createContext();

export const GlobalProvider = (props) => {
  const [allChats, setAllChats] = useState([]);
  const [chatsToMonitor, setChatsToMonitor] = useState([]);
  const [chatToForwardTo, setChatToForwardTo] = useState([]);
  return (
    <GlobalContext.Provider
      value={[
        allChats,
        setAllChats,
        chatsToMonitor,
        setChatsToMonitor,
        chatToForwardTo,
        setChatToForwardTo,
      ]}
    >
      {props.children}
    </GlobalContext.Provider>
  );
};
