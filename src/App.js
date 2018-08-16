import React, { Component } from 'react'
import { injectWeb3, validContract } from './web3'
import { Div, H1 } from 'glamorous'
import { Seperator } from './atoms/Seperator'
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
    validContract("DataVault").then(validNetwork => this.setState({validNetwork}))
    console.log("Mounted")
  }

  render() {
    return (
      <Router createHistory={createBrowserHistory}>
      <div className="App">
       <Route path="/" component={HomeComponent} />
      </div>
      </Router>
    )
  } 
} 
const ChangeNetworkDiv = ({validNetwork}) => {
  if (validNetwork) {
    return null
  }
  return <Div css={{backgroundColor: "red"}}>Invalid Network, Change To Network with contracts deployed</Div>
}

class HomeComponent extends Component {
  componentWillMount() {
    validContract("DataVault").then(validNetwork => this.setState({validNetwork}))
    console.log("Mounted")
  }

  state = {
    validNetwork: true,
  };
  render() {
      console.log("HOME", this.state)
      return (
      <Div>
        <header className="App-header">
          <H1>ABI Explorer - Explore your ABIs</H1>
        </header>
        <Link to="/">Home</Link>
        <ChangeNetworkDiv validNetwork={this.state.validNetwork} />
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

        </Div>
      </Div>
    )}
  }

export default App;