import React from 'react';
import { Card } from '@blueprintjs/core';
import DrawerMenu from './DrawerMenu';

const Header = () => {
  return (
    <Card className="header" elevation="2">
      <div className="header-container">
        <h1 className="main-heading">Oliver Telegram Bot</h1>
        <div>
          <DrawerMenu />
        </div>
      </div>
    </Card>
  );
};

export default Header;
