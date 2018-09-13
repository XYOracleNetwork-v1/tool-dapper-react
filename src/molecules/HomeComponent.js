import React, { Component } from 'react'
import glam, { Div, Img } from 'glamorous'
import { Route } from 'react-router-dom'
import { injectWeb3, validateContracts } from '../web3'
import SmartContractSelector from '../atoms/SmartContractSelector'
import { FunctionsList } from './FunctionsList'
import FunctionDetails from './FunctionDetails'
import logo from '../assets/dapper-logo.svg'
import cog from '../assets/cog.svg'
import './css/HomeComponent.css'

const Sidebar = glam.div({
  display: 'flex',
  flexDirection: 'column',
  width: 413,
  borderRight: '1px solid #979797',
  backgroundColor: '#F8F8F8',
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
          <Img className="image-header-logo" src={logo} />
          <Div className="vertical-center">
            <header className="header-right">Play with your dApps</header>
            <a
              href="https://github.com/XYOracleNetwork/tool-dapper-react"
              className="link-right"
              target="_blank"
            >
              View on Github
            </a>
          </Div>
        </HeaderDiv>
        <MainLayoutDiv>
          <ChangeNetworkDiv validNetwork={validNetwork} />
          <Sidebar>
            <SelectContractLayout>
              <Div className="select-contract-layout">
                <header className="select-contract"> Select Contract </header>{' '}
                <Img src={cog} />
              </Div>
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
