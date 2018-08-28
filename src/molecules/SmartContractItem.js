import React from 'react';
import { Div } from 'glamorous';
import { Link, Route } from 'react-router-dom';
import { contractNamed } from '../web3';
import MethodItem from './MethodItem';

export const MethodLink = ({ match, method }) => (
  <Div key={method.signature}>
    <Link to={`${match.url}/${method.signature}`}>
      {' '}
      {method.name}
      {' '}
    </Link>
  </Div>
);

export const SmartContractItem = (props) => {
  const { match } = props;
  const contractName = match.params.contract;
  const contract = contractNamed(contractName);
  if (!contract) {
    return null;
  }
  /* eslint no-underscore-dangle: */
  const sortedMethods = contract._jsonInterface
    .sort((a, b) => (a.name && b.name ? a.name.localeCompare(b.name) : 0))
    .map((method) => {
      if (method.name && method.type === 'function') {
        return <MethodLink key={method.signature} match={match} method={method} />;
      }
      return undefined;
    });

  return (
    <Div
      css={{
        display: 'flex',
        justifyContent: 'left',
        alignContent: 'left',
        flexDirection: 'column',
        textAlign: 'left',
      }}
    >
      <h3>
        {contractName}
:
      </h3>

      <Div
        css={{
          display: 'flex',
          flexDirection: 'row',
          alignContent: 'left',
          textAlign: 'left',
        }}
      >
        <Div
          css={{
            width: 300,
          }}
        >
          Functions
          <ul>
            {sortedMethods}
          </ul>
        </Div>
        <Div
          css={{
            width: 400,
          }}
        >
          <Route path="/:contract/:method" component={MethodItem} />
        </Div>
      </Div>
    </Div>
  );
};
