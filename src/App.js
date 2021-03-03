import { ipcRenderer } from 'electron';
import React, { useEffect, useContext } from 'react';
import Auth from './components/Auth';
import TabMenu from './components/TabMenu';
import { AppToaster } from './components/Toaster';
import { GlobalContext } from './GlobalContext';

const App = () => {
  const { isMonitoring, setIsMonitoring } = useContext(GlobalContext);
  useEffect(() => {
    ipcRenderer.send('get:chats');
    ipcRenderer.once('open:toast', (event, props) => {
      AppToaster.show({ ...props });
    });
    ipcRenderer.on('update', (event, props) => {
      console.log('⚡ BACK END RECEBEU UPDATE');
      AppToaster.show({ ...props });
    });
    ipcRenderer.on('started:monitoring', (event, props) => {
      setIsMonitoring(true);
      AppToaster.show({ ...props });
    });
    ipcRenderer.on('stopped:monitoring', (event, props) => {
      setIsMonitoring(false);
      AppToaster.show({ ...props });
    });
  }, []); // eslint-disable-line
  return (
    <>
      <div className="container bp3-dark">
        <h1>Oliver Telegram Bot</h1>
        <TabMenu />
        <Auth />
      </div>
    </>
  );
};

export default App;
