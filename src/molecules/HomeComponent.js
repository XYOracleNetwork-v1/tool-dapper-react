import React, { Component } from 'react'
import glam, { Div, Img } from 'glamorous'
import { Route, Link, Redirect } from 'react-router-dom'
import SmartContractService from '../SmartContractService'
import SmartContractSelector from '../atoms/SmartContractSelector'
import { FunctionsList } from './FunctionsList'
import FunctionDetails from './FunctionDetails'
import Settings from './Settings'
import logo from '../assets/dapper-logo.svg'
import cog from '../assets/cog.svg'
import './css/HomeComponent.css'

const Sidebar = glam.div({
  display: 'flex',
  flexDirection: 'column',
  width: 413,
  minWidth: 413,
  borderRight: '1px solid #979797',
  backgroundColor: '#F8F8F8',
})

const SelectContractLayout = glam.div({
  display: 'flex',
  flexDirection: 'column',
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
    <Div
      css={{
        color: '#4D4D5C',
        backgroundColor: '#FF6161',
        width: '100%',
        padding: 10,
      }}
    >
      No contracts deployed at the ABI source. Make sure your contracts are
      deployed on the current ethereum network.
    </Div>
  )
}

class HomeComponent extends Component {
  state = {
    validNetwork: true,
    service: undefined,
    serviceError: undefined,
  }

  componentWillMount() {
    console.log('Creating Smart Contract Service')
    this.service = new SmartContractService()
    this.reloadWeb3()
  }

  reloadWeb3 = () => {
    this.service
      .reloadWeb3()
      .then(() => this.service.validateContracts())
      .then(validNetwork => this.setState({ validNetwork: true }))
      .catch(err => {
        this.setState({ validNetwork: false })
        this.serviceError = err
        console.log('Caught error while injecting', err)
      })
  }

  // validateNetwork

  render() {
    const { validNetwork } = this.state
    return (
      <Div css={{ height: '100%', width: '100%' }}>
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
          <Sidebar>
            <SelectContractLayout>
              <Div className="select-contract-layout">
                <header className="select-contract"> Select Contract </header>{' '}
                <Link to={`/settings`}>
                  <Img src={cog} />
                </Link>
              </Div>
              <SelectContractContainer>
                <SmartContractSelector
                  contracts={this.service.getAllSmartContracts()}
                />
              </SelectContractContainer>
            </SelectContractLayout>
            <Route
              path="/:contract"
              render={props => (
                <FunctionsList {...props} service={this.service} />
              )}
            />
          </Sidebar>
          <Div
            css={{
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            <ChangeNetworkDiv validNetwork={validNetwork} />

            <Route
              path="/settings"
              render={props => (
                <Settings
                  {...props}
                  service={this.service}
                  onSave={this.reloadWeb3}
                />
              )}
            />

            <Route
              path="/:contract/:method"
              render={props => (
                <FunctionDetails {...props} service={this.service} />
              )}
              service={this.state.service}
            />
          </Div>
        </MainLayoutDiv>
      </Div>
    )
  }
}
export default HomeComponent
