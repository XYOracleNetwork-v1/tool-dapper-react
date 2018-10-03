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
  justifyContent: 'space-between',
  width: '100%',
  height: '251px',
  backgroundColor: '#5B5C6D',
})

const SelectContractContainer = glam.div({
  paddingTop: 10,
  paddingLeft: 37,
  paddingRight: 37,
  flex: 1,
})

const HeaderDiv = glam.div({
  display: 'flex',
  flexDirection: 'row',
  justifyContent: 'space-between',
  backgroundColor: '#3c3e51',
  paddingRight: 54,
  height: 113,
  textAlign: 'right',
})

const MainLayoutDiv = glam.div({
  display: 'flex',
  flexDirection: 'row',
  justifyContent: 'flex-start',
  height: '100%',
})

const CurNetwork = ({ account, network }) => {
  let returnDivs = []
  if (account) {
    returnDivs.push(
      <Div key="account" className="account-right">
        Wallet: {account}
      </Div>,
    )
  }
  if (network) {
    returnDivs.push(
      <Div key="network" className="network-right">
        Network: {network}
      </Div>,
    )
  }
  return <Div>{returnDivs}</Div>
}

const ChangeNetworkDiv = ({ validNetwork }) => {
  if (validNetwork === true) {
    return null
  }
  return (
    <Div>
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
      <Redirect to="/settings" />
    </Div>
  )
}

class HomeComponent extends Component {
  state = {
    validNetwork: true,
    service: new SmartContractService(),
    serviceError: undefined,
  }

  componentWillMount() {
    // Will refresh local store when new user is chosen:
    if (this.state.service.getCurrentConfigStore()) {
      this.state.service.getCurrentConfigStore().on('update', this.reloadWeb3)
    }
    this.reloadWeb3()
  }

  reloadWeb3 = () => {
    this.state.service
      .reloadWeb3()
      .then(() => this.state.service.validateContracts())
      .then(validNetwork => {
        this.setState({
          validNetwork: validNetwork,
        })
      })
      .catch(err => {
        this.setState({ validNetwork: false })
        if (err) {
          this.setState({ serviceError: err })
        }
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
            <a
              href="https://github.com/XYOracleNetwork/tool-dapper-react"
              className="link-right"
              target="_blank"
              rel="noopener noreferrer"
            >
              View on Github
            </a>
            <CurNetwork
              account={this.state.service.getCurrentUser()}
              network={this.state.service.getCurrentNetwork()}
            />
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
                  contracts={this.state.service.getSmartContracts()}
                />
              </SelectContractContainer>
              <Route
                path="/:contract"
                render={props => {
                  const match = props.match
                  if (!match.params) {
                    return <Div />
                  }
                  const contractName = match.params.contract
                  const contract = this.state.service.contractObject(
                    contractName,
                  )
                  if (!contract) {
                    return <Div />
                  }
                  return (
                    <Div>
                      <Div
                        css={{
                          display: 'flex',
                          flexDirection: 'row',
                          textAlign: 'center',
                          justifyContent: 'space-between',
                          paddingTop: 14,
                          paddingLeft: 14,
                          paddingRight: 14,
                          color: '#C8C8C8',
                          fontFamily: 'PT Sans',
                          fontSize: 14,
                        }}
                      >
                        <Div>On Networks:</Div>
                        {this.state.service.getNetworksString(
                          contract.networks,
                        )}
                      </Div>
                      <Div
                        css={{
                          display: 'flex',
                          flexDirection: 'row',
                          textAlign: 'center',
                          justifyContent: 'space-between',
                          paddingBottom: 14,
                          paddingLeft: 14,
                          paddingRight: 14,
                          color: '#C8C8C8',
                          fontFamily: 'PT Sans',
                          fontSize: 14,
                        }}
                      >
                        <Div>Address:</Div>
                        {contract.address}
                      </Div>
                    </Div>
                  )
                }}
              />
            </SelectContractLayout>
            <Route
              path="/:contract"
              render={props => (
                <FunctionsList {...props} service={this.state.service} />
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
                  service={this.state.service}
                  onSave={this.reloadWeb3}
                />
              )}
            />

            <Route
              path="/:contract/:method"
              render={props => (
                <FunctionDetails {...props} service={this.state.service} />
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
