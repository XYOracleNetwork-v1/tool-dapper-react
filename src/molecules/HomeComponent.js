import React, { Component } from 'react';
import { Div, H1 } from 'glamorous';
import { Route, Link } from 'react-router-dom';
import { injectWeb3, validContract } from '../web3';
import Seperator from '../atoms/Seperator';
import SmartContractList from '../atoms/SmartContractList';
import { SmartContractItem } from './SmartContractItem';

const ChangeNetworkDiv = ({ validNetwork }) => {
  if (validNetwork === true) {
    return null;
  }
  return (
    <Div css={{ backgroundColor: 'red' }}>
      Invalid network, move to network where contracts are deployed
    </Div>
  );
};

class HomeComponent extends Component {
  state = {
    validNetwork: true,
  };

  componentWillMount() {
    injectWeb3().then(() => validContract('DataVault').then(validNetwork => this.setState({ validNetwork })));
  }

  render() {
    const { validNetwork } = this.state;
    return (
      <Div>
        <header className="App-header">
          <H1>
Dapper - Play with your dApps
          </H1>
        </header>
        <Link to="/">
Home
        </Link>
        <ChangeNetworkDiv validNetwork={validNetwork} />
        <hr />
        <h3>
          {' '}
Select Contract
          {' '}
        </h3>
        <Div
          css={{
            display: 'flex',
            justifyContent: 'left',
            alignContent: 'left',
            flexDirection: 'column',
          }}
        >
          Smart Contracts Loaded:
          <Route path="/" component={SmartContractList} />
          <Seperator />
          <Route path="/:contract" component={SmartContractItem} />
        </Div>
      </Div>
    );
  }
}
export default HomeComponent;
