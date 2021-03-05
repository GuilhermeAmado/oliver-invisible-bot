import { ipcRenderer } from 'electron';
import React, { useEffect, useContext } from 'react';
import About from './components/About';
import Auth from './components/Auth';
import Header from './components/Header';
import TabMenu from './components/TabMenu';
import { AppToaster } from './components/Toaster';
import { GlobalContext } from './GlobalContext';

const App = () => {
  const { setIsConnected, setIsMonitoring } = useContext(GlobalContext);
  const { isAboutOpen, setIsAboutOpen } = useContext(GlobalContext);
  useEffect(() => {
    ipcRenderer.send('get:auth-state');
    ipcRenderer.once('got:auth-state', (event, props) => {
      if (props._ === 'authorizationStateReady') {
        setIsConnected(true);
      } else {
        setIsConnected(false);
      }
    });
    ipcRenderer.on('auth:needed', (event, props) => {
      console.log('OPA! O usuário precisa fazer login!!! ⚡');
    });
    ipcRenderer.on('auth:ok', (event, props) => {
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
      <div className="bp3-dark">
        <Header />
        <div className="container">
          <TabMenu />
          <Auth />
        </div>
        <About />
      </div>
    </>
  );
};

export default App;
