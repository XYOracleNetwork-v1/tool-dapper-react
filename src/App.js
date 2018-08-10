import React, { Component } from 'react'
import { injectWeb3} from './web3'
import { Div, H1 } from 'glamorous'
import { Seperator } from './atoms/Seperator'
import { TransactionReceipt } from './molecules/TransactionReceipt'
import { SmartContractList } from './molecules/SmartContractList'
import { BrowserRouter as Router, Route, Link } from "react-router-dom";

import './App.css';

class App extends Component {

  componentWillMount() {
    injectWeb3()
    console.log("Mounted")
  }

  state = {
    ethAddress: '',
    blockNumber: '',
    transactionHash: '',
    gasUsed: '',
    txReceipt: '',
    gasPrice: 0,
  };

  render() {
    return (
      <Router>
      <div className="App">
       <Route exact path="/" component={Home} />
      </div>
      </Router>
    )
  } 
} 
const Home = ({match}) => (
  <Div>
<header className="App-header">
          <H1>ABI Explorer - Explore your ABIs</H1>
        </header>
          
        <hr />
        <h3> Select Contract </h3>
        <Div css = {{ 
          display: 'flex',
          justifyContent: 'left',
          alignContent: 'left',
          flexDirection: 'column',
        }}
        >
        Smart Contracts Loaded:
          <Route exact path="/" component={SmartContractList} />

          <Seperator />
          <Route path={`${match.url}/:contractName`} component={SmartContractItem} />

          <TransactionReceipt {...this.state} />
        </Div>
  </Div>
)

const SmartContractItem = ({name}) => <Div>
    Select a smart contract
    </Div>
export default App;
