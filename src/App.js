import { ipcRenderer } from 'electron';
import React, { useEffect } from 'react';
import { Button, Intent, Spinner } from '@blueprintjs/core';
import Auth from './components/Auth';
const mySpinner = <Spinner intent={Intent.PRIMARY} />;

const App = () => {
  useEffect(() => {
    ipcRenderer.on('ping', (event, message) => {
      console.log('IT WORKS!');
      console.log(message);
    });
  }, []);
  return (
    <div className="container bp3-dark">
      <h1>Hello World</h1>
      <h3>oliver telegram bot</h3>
      <Auth />
    </div>
  );
};

export default App;
