import React from 'react';
import { Classes } from '@blueprintjs/core';
import PhoneInput from 'react-phone-input-2';
import '../input.css';

const PhonePanel = (props) => {
  const [phone, setPhone] = props.setPhone;
  return (
    <div className={Classes.DIALOG_BODY}>
      <div>
        <p>
          Informe o número telefone associado com a sua conta no Telegram.
          <small> (Somente números)</small>
        </p>

        <PhoneInput
          country={'br'}
          value={phone}
          onChange={(phone) => setPhone(phone)}
          onlyCountries={['br']}
          placeholder="+55 (99) 8888-0000"
          disableDropdown="true"
          countryCodeEditable="false"
        />
      </div>
    </div>
  );
};

export default PhonePanel;
