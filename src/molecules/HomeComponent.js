import React, { Component } from 'react'
import glam, { Div } from 'glamorous'
import { Route } from 'react-router-dom'
import { injectWeb3, validateContracts } from '../web3'
import SmartContractSelector from '../atoms/SmartContractSelector'
import { FunctionsList } from './FunctionsList'
import FunctionDetails from './FunctionDetails'

import './css/HomeComponent.css'

const Sidebar = glam.div({
  display: 'flex',
  flexDirection: 'column',
  width: 413,
  borderRight: '1px solid #979797',
})

const SelectContractLayout = glam.div({
  display: 'flex',
  flexDirection: 'column',
  // justifyContent: 'space-around',
  width: '100%',
  height: '251px',
  backgroundColor: '#5B5C6D',
})

const SelectContractContainer = glam.div({
  paddingLeft: 37,
  paddingRight: 37,
  paddingTop: 30,
})

const HeaderDiv = glam.div({
  display: 'flex',
  flexDirection: 'row',
  justifyContent: 'space-between',
  backgroundColor: '#3c3e51',
  paddingRight: 54,
  height: 113,
})

const MainLayoutDiv = glam.div({
  display: 'flex',
  flexDirection: 'row',
  justifyContent: 'flex-start',
  height: '100%',
})

const ChangeNetworkDiv = ({ validNetwork }) => {
  if (validNetwork === true) {
    return null
  }
  return (
    <Div css={{ backgroundColor: 'red' }}>
      Invalid network, move to network where contracts are deployed
    </Div>
  )
}

class HomeComponent extends Component {
  state = {
    validNetwork: true,
  }

  componentWillMount() {
    injectWeb3()
      .then(() =>
        validateContracts().then(validNetwork =>
          this.setState({ validNetwork }),
        ),
      )
      .catch(err => {
        console.log('Caught error while injecting', err)
      })
  }

  render() {
    const { validNetwork } = this.state
    return (
      <Div css={{ height: '100%' }}>
        <HeaderDiv>
          <header className="App-header">dApper</header>
          <header className="header-right">Play with your dApps</header>
        </HeaderDiv>
        <MainLayoutDiv>
          <ChangeNetworkDiv validNetwork={validNetwork} />
          <Sidebar>
            <SelectContractLayout>
              <header className="select-contract"> Select Contract </header>
              <SelectContractContainer>
                <SmartContractSelector />
              </SelectContractContainer>
            </SelectContractLayout>
            <Route path="/:contract" component={FunctionsList} />
          </Sidebar>
          <Route path="/:contract/:method" component={FunctionDetails} />
        </MainLayoutDiv>
      </Div>
    )
  }
}
export default HomeComponent
