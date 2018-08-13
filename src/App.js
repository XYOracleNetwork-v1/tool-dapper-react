import React, { Component } from 'react'
import { injectWeb3} from './web3'
import { Div, H1 } from 'glamorous'
import { Seperator } from './atoms/Seperator'
import { TransactionReceipt } from './molecules/TransactionReceipt'
import { SmartContractList } from './molecules/SmartContractList'
import { BrowserRouter as Router, Route, Link} from "react-router-dom";
import { createBrowserHistory } from 'history'
import { SmartContractItem } from './molecules/SmartContractItem'
import { MethodItem } from './molecules/MethodItem'

import './App.css';
import { create } from 'domain';
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
      <Router createHistory={createBrowserHistory}>
      <div className="App">
       <Route path="/" component={Home} />
      </div>
      </Router>
    )
  } 
} 
const Home = ({match}) => {
  console.log("HOME", match)
  return (
  <Div>
<header className="App-header">
          <H1>ABI Explorer - Explore your ABIs</H1>
        </header>
          <Link to="/" component={Home}>Home</Link>
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
          <Route path="/" component={SmartContractList} />

          <Seperator />
          <Route path={`/:contract`} component={SmartContractItem} />
          <Route path={`/:contract/:method`} component={MethodItem} />

          <TransactionReceipt {...this.state} />
        </Div>
  </Div>
)}

export default App;