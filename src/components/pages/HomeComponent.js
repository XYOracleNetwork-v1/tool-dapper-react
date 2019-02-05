import React, { Component } from 'react'
import { Div } from 'glamorous'
import { Route, Switch, withRouter } from 'react-router-dom'
import { withCookies } from 'react-cookie'
import PerfectScrollbar from 'perfect-scrollbar'
import 'perfect-scrollbar/css/perfect-scrollbar.css'

import SmartContractService from '../../util/SmartContractService'
import FunctionDetails from './../organisms/FunctionDetails'
import Settings from './Settings'
import PageHeader from '../molecules/PageHeader'
import ContractDeployment from './../organisms/ContractDeployment'
import SelectedContractDiv from '../molecules/SelectedContractDiv'
import SettingsIPFSDownload from '../molecules/SettingsIPFSDownload'
import DappHelperComponent from './../organisms/DappHelperComponent'
import Sidebar from '../molecules/Sidebar'
import ABISearch from './ABISearch'
import IPFSUploader from './IPFSUploader'
import ContractSimulator from './ContractSimulator'

class HomeComponent extends Component {
  state = {
    service: new SmartContractService(
      () => this.forceUpdate(),
      this.props.cookies,
    ),
    // selectedContractName: undefined,
    // serviceError: undefined,
    // currentUser: undefined,
    deploymentSelection: {},
    contracts: [],
  }

  componentDidMount() {
    this.sidebarScroll = new PerfectScrollbar('.sidebar')
    this.contentScroll = new PerfectScrollbar('.content')
    this.state.service.loadLocalStoreObjects()
    this.state.service.loadIPFSContracts(this.props.cookies).catch(e => {
      console.log(`Cannot load invalid ipfs contracts`)
    })
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    this.sidebarScroll.update()
    this.contentScroll.update()
  }

  connectProvider = async () => {
    const { cookies } = this.props
    const { service } = this.state
    await service.loadWeb3(cookies)
    const currentNetwork = service.getCurrentNetwork()
    const currentUser = service.getCurrentUser()
    const contracts = service.getSmartContracts()
    this.setState({ currentNetwork, currentUser, contracts })
  }

  getDeployedContractObjects = contract =>
    this.state.service.deployedContractObjects(contract) || []

  getContractObject = contract =>
    this.state.service.contractObject(contract) || {}

  createContract = (abi, address) =>
    this.state.service.createContract(abi, address)

  render() {
    const {
      deploymentSelection,
      service,
      currentNetwork,
      currentUser,
      contracts,
    } = this.state
    return (
      <Div
        css={{
          // minWidth: '100vw',
          // minHeight: '100vh',
          height: `100%`,
          // width: `100%`,
          backgroundImage: `linear-gradient(338deg, #8d8fc6, #190e24)`,
          display: 'grid',
          gridTemplateRows: '125px 1fr',
          gridTemplateColumns: '420px 1fr',
          gridTemplateAreas: `
          'header header'
          'sidebar body'
        `,
        }}
      >
        <PageHeader
          connectProvider={this.connectProvider}
          network={currentNetwork}
          account={currentUser}
        />
        <Sidebar
          deploymentSelection={deploymentSelection}
          network={currentNetwork}
          contracts={contracts}
          getDeployedContractObjects={this.getDeployedContractObjects}
          getContractObject={this.getContractObject}
          updateContract={selectedContractName =>
            this.setState({
              selectedContractName,
              deploymentSelection: {},
            })
          }
          updateDeploymentSelection={deploymentSelection =>
            this.setState({ deploymentSelection })
          }
        />
        <Div
          className="content"
          css={{
            display: 'flex',
            flexDirection: 'column',
            width: '100%',
            gridArea: 'body',
            position: 'relative',
            padding: '25px 20px',
          }}
        >
          <Switch>
            <Route path="/search" component={ABISearch} />
            <Route
              path="/upload"
              render={() => <IPFSUploader service={service} />}
            />
            <Route
              exact
              path="/simulator"
              render={() => <ContractSimulator service={service} />}
            />
            <Route
              exact
              path="/settings"
              render={props => (
                <Settings
                  {...props}
                  service={service}
                  portisNetworkChange={async network => {
                    await service.changePortisNetwork(network)
                    this.forceUpdate()
                  }}
                />
              )}
            />
            <Route
              exact
              path="/settings/:ipfs"
              render={props => (
                <SettingsIPFSDownload {...props} service={service} />
              )}
            />
            <Route
              path="/helpers"
              render={props => (
                <DappHelperComponent
                  {...props}
                  service={service}
                  selectedAddress={deploymentSelection.address}
                />
              )}
            />
            <Route
              exact
              path="/simulator/:contractName/deploy"
              render={props => (
                <ContractDeployment
                  {...props}
                  service={service}
                  onDeploy={selection =>
                    this.setState({
                      deploymentSelection: selection,
                    })
                  }
                />
              )}
            />
            <Route
              exact
              path="/simulator/:contract/functions/:method"
              render={props => (
                <FunctionDetails
                  {...props}
                  getContractObject={this.getContractObject}
                  user={currentUser}
                  createContract={this.createContract}
                  selectedAddress={deploymentSelection.address}
                  network={currentNetwork}
                />
              )}
            />
          </Switch>

          <Route
            exact
            path="/simulator/:contract"
            render={props => (
              <SelectedContractDiv
                {...props}
                service={service}
                selectedAddress={deploymentSelection.address}
              />
            )}
            service={service}
          />
        </Div>
      </Div>
    )
  }
}

export default withRouter(withCookies(HomeComponent))
