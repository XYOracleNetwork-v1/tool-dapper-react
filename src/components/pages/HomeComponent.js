import React, { Component } from 'react'
import { Div } from 'glamorous'
import { Route, Switch, withRouter } from 'react-router-dom'
import { withCookies } from 'react-cookie'
import PerfectScrollbar from 'perfect-scrollbar'
import 'perfect-scrollbar/css/perfect-scrollbar.css'

import SmartContractService from '../../util/SmartContractService'
import web3helpers from '../../util/web3helpers'
import PrivateRoute from '../atoms/PrivateRoute'
import PageHeader from '../organisms/PageHeader'
import Sidebar from '../organisms/Sidebar'
import Settings from './Settings'
import FunctionDetails from './FunctionDetails'
import ContractDeployment from './ContractDeployment'
import SelectedContract from './SelectedContract'
import SettingsIPFSDownload from './SettingsIPFSDownload'
import ABISearch from './ABISearch'
import IPFSUploader from './IPFSUploader'
import ContractSimulator from './ContractSimulator'
import Login from './Login'
import Web3HelperExecution from './Web3HelperExecution'
import IPFSClient from '../../util/IPFS'

class HomeComponent extends Component {
  constructor(props) {
    super(props)
    this.ipfsClient = new IPFSClient(props.cookies)
    this.service = new SmartContractService(
      () => this.forceUpdate(),
      props.cookies,
      this.ipfsClient,
    )
    this.state = {
      deploymentSelection: {},
      contracts: [],
      helpers: web3helpers,
      ipfsConfig: this.ipfsClient.getIpfsConfig(),
    }
  }

  async componentDidMount() {
    this.sidebarScroll = new PerfectScrollbar('.sidebar')
    this.contentScroll = new PerfectScrollbar('.content')
    try {
      await this.service.loadLocalStoreObjects()
      await this.service.loadIPFSContracts()
    } catch (err) {
      console.log(err)
    }
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    this.sidebarScroll.update()
    this.contentScroll.update()
  }

  connectProvider = async () => {
    const { cookies } = this.props
    await this.service.loadWeb3(cookies)
    const currentNetwork = this.service.getCurrentNetwork()
    const currentUser = this.service.getCurrentUser()
    const contracts = this.service.getSmartContracts()
    this.setState({ currentNetwork, currentUser, contracts })
  }

  getDeployedContractObjects = contract =>
    this.service.deployedContractObjects(contract) || []

  getContractObject = contract => this.service.contractObject(contract) || {}

  createContract = (abi, address) => this.service.createContract(abi, address)

  loadIPFSContracts = () => this.service.loadIPFSContracts()
  uploadIPFS = data => this.ipfsClient.uploadFiles(data)
  updateIPFSConfig = config => this.ipfsClient.updateIpfsConfig(config)

  render() {
    const {
      deploymentSelection,
      currentNetwork,
      currentUser,
      contracts,
      helpers,
      ipfsConfig,
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
          helpers={helpers}
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
            <Route
              path="/login"
              render={props => <Login {...props} user={currentUser} />}
            />
            <Route path="/search" component={ABISearch} />
            <Route
              path="/upload"
              render={() => (
                <IPFSUploader
                  loadIPFSContracts={this.loadIPFSContracts}
                  uploadIPFS={this.uploadIPFS}
                  ipfsConfig={ipfsConfig}
                  updateIPFSConfig={this.updateIPFSConfig}
                />
              )}
            />
            <Route
              exact
              path="/simulator"
              render={() => <ContractSimulator service={this.service} />}
            />
            <Route
              exact
              path="/settings"
              render={props => (
                <Settings
                  {...props}
                  service={this.service}
                  portisNetworkChange={async network => {
                    await this.service.changePortisNetwork(network)
                  }}
                  ipfsConfig={ipfsConfig}
                  loadIPFSContracts={this.loadIPFSContracts}
                  uploadIPFS={this.uploadIPFS}
                  updateIPFSConfig={this.updateIPFSConfig}
                />
              )}
            />
            <Route
              exact
              path="/settings/:ipfs"
              render={props => (
                <SettingsIPFSDownload {...props} service={this.service} />
              )}
            />
            <PrivateRoute
              exact
              path="/helpers"
              authenticated={currentUser}
              render={() => <div>Select a helper from the left menu</div>}
            />
            <PrivateRoute
              exact
              authenticated={currentUser}
              path="/helpers/:funcId"
              render={props => (
                <Web3HelperExecution
                  {...props}
                  helpers={helpers}
                  network={currentNetwork}
                  web3={this.service.web3}
                />
              )}
            />
            <PrivateRoute
              exact
              authenticated={currentUser}
              path="/simulator/:contractName/deploy"
              render={props => (
                <ContractDeployment
                  {...props}
                  service={this.service}
                  onDeploy={selection =>
                    this.setState({
                      deploymentSelection: selection,
                    })
                  }
                />
              )}
            />
            <PrivateRoute
              exact
              authenticated={currentUser}
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
              <SelectedContract
                {...props}
                service={this.service}
                selectedAddress={deploymentSelection.address}
              />
            )}
          />
        </Div>
      </Div>
    )
  }
}

export default withRouter(withCookies(HomeComponent))
