import { ipcRenderer } from 'electron';
import React, { useEffect } from 'react';
import { Intent, Spinner } from '@blueprintjs/core';
import Auth from './components/Auth';
import TabMenu from './components/TabMenu';
import { AppToaster } from './components/Toaster';
const mySpinner = <Spinner intent={Intent.PRIMARY} />;

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
      <div className="container bp3-dark">
        <h1>Oliver Telegram Bot</h1>
        <TabMenu />
        <Auth />
      </div>
    </>
  );
};

export default App;
