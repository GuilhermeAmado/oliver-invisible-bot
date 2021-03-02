import { Tab, Tabs, Card } from '@blueprintjs/core';
import FwMessagesPanel from './FwMessagesPanel';

import React from 'react';

const TabMenu = () => {
  return (
    <Card>
      <Tabs id="TabsExample" selectedTabId="fw" vertical="true">
        <Tab id="fw" title="Encaminhar Mensagens" panel={<FwMessagesPanel />} />
        <Tab id="ma" title="Minha conta" disabled="true" />
        <Tabs.Expander />
      </Tabs>
    </Card>
  );
};

export default TabMenu;
