import React, { useState, createContext } from 'react';

export const GlobalContext = createContext();

export const GlobalProvider = (props) => {
  const [allChats, setAllChats] = useState([]);
  const [chatsToMonitor, setChatsToMonitor] = useState([]);
  const [chatToForwardTo, setChatToForwardTo] = useState([]);
  const [isMonitoring, setIsMonitoring] = useState(false);
  const [showAuthDialog, setShowAuthDialog] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [connected, setIsConnected] = useState(false);
  const [isAboutOpen, setIsAboutOpen] = useState(false);
  return (
    <GlobalContext.Provider
      value={{
        allChats,
        setAllChats,
        chatsToMonitor,
        setChatsToMonitor,
        chatToForwardTo,
        setChatToForwardTo,
        isMonitoring,
        setIsMonitoring,
        showAuthDialog,
        setShowAuthDialog,
        isDrawerOpen,
        setIsDrawerOpen,
        connected,
        setIsConnected,
        isAboutOpen,
        setIsAboutOpen,
      }}
    >
      {props.children}
    </GlobalContext.Provider>
  );
};
