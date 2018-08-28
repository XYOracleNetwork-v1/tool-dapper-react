import React from 'react';
import { Div } from 'glamorous';
import { Link } from 'react-router-dom';
import { SmartContracts } from '../web3';

const SmartContractList = () => (
  <Div
    css={{
      margin: 10,
      height: 20,
      display: 'flex',
      flexDirection: 'column',
      textAlign: 'left',
    }}
  >
    {SmartContracts.map(contract => (
      <Div key={contract.name}>
        <Link to={`/${contract.name}`} params={{ ...contract }}>
          {contract.name}
        </Link>
      </Div>
    ))}
  </Div>
);

export default SmartContractList;
