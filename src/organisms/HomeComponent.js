import React, { Component } from 'react'
import glam, { Div, Img } from 'glamorous'
import { Route, Link, Switch, withRouter } from 'react-router-dom'
import { withCookies } from 'react-cookie'
import PerfectScrollbar from 'perfect-scrollbar'
import 'perfect-scrollbar/css/perfect-scrollbar.css'

import SmartContractService from './SmartContractService'
import SmartContractSelector from '../atoms/SmartContractSelector'
import ContractAddressDropdown from '../atoms/ContractAddressDropdown'
import { FunctionsList } from '../molecules/FunctionsList'
import FunctionDetails from './FunctionDetails'
import Settings from './Settings'
import cog from '../assets/cog.svg'
import PageHeader from '../molecules/PageHeader'
import ContractDeployment from './ContractDeployment'
import SelectedContractDiv from '../molecules/SelectedContractDiv'
import SettingsIPFSDownload from '../molecules/SettingsIPFSDownload'
import DappHelperComponent from './DappHelperComponent'

const Sidebar = glam.div('sidebar', {
  display: `flex`,
  flexDirection: `column`,
  // width: 413,
  // minWidth: 413,
  // height: `100%`,
  // borderRight: `1px solid #979797`,
  // backgroundColor: `#F8F8F8`,
  gridArea: 'sidebar',
  maxHeight: '100%',
  // height: 'auto',
  // width: 'auto',
  overflow: 'hidden',
  position: 'relative',
})

const SelectContractLayout = glam.div({
  display: `flex`,
  // height: 250,
  flexDirection: `column`,
  // backgroundColor: `#5B5C6D`,
  fontFamily: `PT Sans`,
  padding: 30,
})

const SelectContractHeader = glam.div({
  color: `white`,
  fontSize: 23,
})

const SpaceBetweenRow = glam.div({
  display: `flex`,
  flexDirection: `row`,
  justifyContent: `space-between`,
})

const MainLayoutDiv = glam.div({
  display: `flex`,
  flexDirection: `row`,
  justifyContent: `flex-start`,
  flex: 1,
  height: `100%`,
})

class HomeComponent extends Component {
  state = {
    service: new SmartContractService(
      () => this.forceUpdate(),
      this.props.cookies,
    ),
    selectedContractName: undefined,
    serviceError: undefined,
    currentUser: undefined,
    deploymentSelection: {},
  }

  currentBaseRoute = () => {
    if (this.props.history && this.props.history.location.pathname) {
      let { pathname } = this.props.history.location
      if (pathname.lastIndexOf(`/`) > 0) {
        return pathname.slice(1).substring(0, pathname.lastIndexOf(`/`) - 1)
      }
      return pathname.slice(1)
    }
  }

  componentDidMount() {
    this.scrolly = new PerfectScrollbar('.sidebar')
    this.state.service.loadLocalStoreObjects()
    this.state.service.loadIPFSContracts(this.props.cookies).catch(e => {
      console.log(`Cannot load invalid ipfs contracts`)
    })
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    this.scrolly.update()
  }

  fetchContractObjects = () => {
    let baseRoute = this.currentBaseRoute()
    if (baseRoute !== `settings`) {
      return this.state.service.deployedContractObjects(baseRoute)
    }
    return []
  }

  render() {
    return (
      <Div css={{
        minWidth: '100vw',
        minHeight: '100vh',
        // height: `100%`,
        // width: `100%`,
        backgroundImage: `linear-gradient(338deg, #8d8fc6, #190e24)`,
        display: 'grid',
        gridTemplateRows: '125px 1fr',
        gridTemplateColumns: '420px 1fr',
        gridTemplateAreas: `
          'header header'
          'sidebar body'
        `,
      }}>
        <PageHeader service={this.state.service}/>
        <Sidebar>
          <SelectContractLayout>
            <SpaceBetweenRow>
              <SelectContractHeader>Select Contract</SelectContractHeader>
              <Link to={`/settings`}>
                <Img src={cog}/>
              </Link>
            </SpaceBetweenRow>
            <SmartContractSelector
              onSelect={selection => {
                this.setState({
                  selectedContractName: selection,
                  deploymentSelection: {},
                })
              }}
              selectedContractName
              contracts={this.state.service.getSmartContracts()}
            />
            <ContractAddressDropdown
              onSelect={selection => {
                this.setState({
                  deploymentSelection: selection,
                })
              }}
              contractObjects={this.fetchContractObjects()}
              service={this.state.service}
              selectedAddress={this.state.deploymentSelection.address}
              selectedNotes={this.state.deploymentSelection.notes}
            />
          </SelectContractLayout>
          <Route
            path='/:contract'
            render={props => (
              <FunctionsList {...props} service={this.state.service}/>
            )}
          />
        </Sidebar>
        <Div
          css={{
            display: `flex`,
            flexDirection: `column`,
            width: `100%`,
            gridArea: 'body',
          }}
        >
          <Switch>
            <Route
              exact
              path='/settings/:ipfs'
              render={props => (
                <SettingsIPFSDownload
                  {...props}
                  service={this.state.service}
                />
              )}
              service={this.state.service}
            />
            <Route
              exact
              path='/:contractName/deploy'
              render={props => (
                <ContractDeployment
                  {...props}
                  service={this.state.service}
                  onDeploy={selection =>
                    this.setState({
                      deploymentSelection: selection,
                    })
                  }
                />
              )}
              service={this.state.service}
            />
            <Route
              path='/dappHelpers'
              render={props => (
                <DappHelperComponent
                  {...props}
                  service={this.state.service}
                  selectedAddress={this.state.deploymentSelection.address}
                />
              )}
              service={this.state.service}
            />
            <Route
              exact
              path='/:contract/:method'
              render={props => (
                <FunctionDetails
                  {...props}
                  service={this.state.service}
                  selectedAddress={this.state.deploymentSelection.address}
                />
              )}
              service={this.state.service}
            />

            <Route
              path='/settings'
              render={props => (
                <Settings
                  {...props}
                  service={this.state.service}
                  portisNetworkChange={async network => {
                    await this.state.service.changePortisNetwork(network)
                    this.forceUpdate()
                  }}
                />
              )}
            />
          </Switch>

          <Route
            exact
            path='/:contract'
            render={props => (
              <SelectedContractDiv
                {...props}
                service={this.state.service}
                selectedAddress={this.state.deploymentSelection.address}
              />
            )}
            service={this.state.service}
          />
        </Div>
      </Div>
    )
  }
}

export default withRouter(withCookies(HomeComponent))
