import { ipcRenderer } from 'electron';
import React, { useState, useContext, useEffect } from 'react';
import { remote } from 'electron';
import {
  Button,
  Menu,
  MenuItem,
  MenuDivider,
  Drawer,
  Tag,
  Dialog,
} from '@blueprintjs/core';
import Boop from './Boop';
import { GlobalContext } from '../GlobalContext';

const SettingsMenu = () => {
  const { isDrawerOpen, setIsDrawerOpen } = useContext(GlobalContext);
  const { connected, setIsConnected } = useContext(GlobalContext);
  const { showAuthDialog, setShowAuthDialog } = useContext(GlobalContext);
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
  }, []); //eslint-disable-line

  function handleClickConnect() {
    setIsDrawerOpen(false);
    setShowAuthDialog(true);
  }
  function handleClickAbout() {
    setIsDrawerOpen(false);
    setIsAboutOpen(true);
  }
  return (
    <>
      <Menu className="drawer-menu">
        <Tag
          className="status-tag"
          fill
          intent={connected ? 'success' : 'danger'}
        >
          Status: {connected ? 'conectado' : 'desconectado'}
        </Tag>
        <MenuItem
          icon="feed"
          text="Conectar ao Telegram"
          onClick={handleClickConnect}
          disabled={connected}
        />
        <MenuItem icon="cross" text="Desconectar" disabled={!connected} />
        <MenuDivider />
        <MenuItem
          icon="info-sign"
          text="Sobre o Oliver Bot"
          onClick={handleClickAbout}
        />
      </Menu>
    </>
  );
};

const DrawerMenu = () => {
  const { isDrawerOpen, setIsDrawerOpen } = useContext(GlobalContext);
  const { isAboutOpen, setIsAboutOpen } = useContext(GlobalContext);
  function handleCloseMenu() {
    setIsDrawerOpen(false);
  }
  function handleMinimize() {
    remote.getCurrentWindow().minimize();
  }
  function handleSettings() {
    setIsDrawerOpen(true);
  }
  function handleClickHelp() {
    setIsDrawerOpen(false);
    setIsAboutOpen(true);
  }
  function handleClose() {
    ipcRenderer.send('quit:app');
  }
  return (
    <>
      <Drawer
        isOpen={isDrawerOpen}
        onClose={handleCloseMenu}
        canOutsideClickClose="true"
        position="right"
        size="small"
        className="bp3-dark"
      >
        <SettingsMenu />
      </Drawer>
      <div className="button-group">
        <Boop rotation={20} timing={200}>
          <Button icon="cog" minimal onClick={handleSettings} />
        </Boop>
        <Boop rotation={20} timing={200}>
          <Button icon="help" minimal onClick={handleClickHelp} />
        </Boop>
        <Button icon="minus" minimal onClick={handleMinimize} />
        <Button icon="cross" minimal onClick={handleClose} />
      </div>
    </>
  );
};

export default DrawerMenu;
