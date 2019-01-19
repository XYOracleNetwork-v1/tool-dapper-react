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
    const { deploymentSelection, service } = this.state
    return (
      <Div
        css={{
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
        }}
      >
        <PageHeader service={service} />
        <Sidebar
          deploymentSelection={deploymentSelection}
          service={service}
          updateContract={selectedContractName =>
            this.setState({
              selectedContractName,
              deploymentSelection: {},
            })
          }
          contractObjects={this.fetchContractObjects()}
          updateDeploymentSelection={deploymentSelection =>
            this.setState({ deploymentSelection })
          }
        />
        <Div
          css={{
            display: `flex`,
            flexDirection: `column`,
            width: `100%`,
            gridArea: 'body',
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
              path="/dappHelpers"
              render={props => (
                <DappHelperComponent
                  {...props}
                  service={service}
                  selectedAddress={deploymentSelection.address}
                />
              )}
              service={service}
            />
            <Route
              exact
              path="/:contractName/deploy"
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
              path="/:contract/:method"
              render={props => (
                <FunctionDetails
                  {...props}
                  service={service}
                  selectedAddress={deploymentSelection.address}
                />
              )}
            />
          </Switch>

          <Route
            exact
            path="/:contract"
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
