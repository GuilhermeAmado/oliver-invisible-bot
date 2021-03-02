import { ipcRenderer } from 'electron';
import React, { useEffect } from 'react';
import Auth from './components/Auth';
import TabMenu from './components/TabMenu';
import { AppToaster } from './components/Toaster';
import { GlobalProvider } from './GlobalContext';

const App = () => {
  useEffect(() => {
    ipcRenderer.send('get:chats');
    ipcRenderer.once('open:toast', (event, props) => {
      console.log('IT WORKS!');
      AppToaster.show({ ...props });
    });
  }, []);
  return (
    <>
      <GlobalProvider>
        <div className="container bp3-dark">
          <h1>Oliver Telegram Bot</h1>
          <TabMenu />
          <Auth />
        </div>
      </GlobalProvider>
    </>
  );
};

export default App;
