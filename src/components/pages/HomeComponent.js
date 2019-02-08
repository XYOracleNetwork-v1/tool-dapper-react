import React, { useRef, useState } from 'react'
import { Div } from 'glamorous'
import { Route, Switch, withRouter } from 'react-router-dom'
import PerfectScrollbar from 'perfect-scrollbar'
import 'perfect-scrollbar/css/perfect-scrollbar.css'
import { useOnMount } from 'react-hanger'

import { useScsc } from '../../util/SmartContractService'
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
import { useIPFS } from '../../util/IPFS'

const HomeComponent = () => {
  const ipfsClient = useIPFS()
  const { updateIpfsConfig, uploadFiles, ipfsConfig } = ipfsClient
  const service = useScsc(ipfsClient)
  // console.log(service)
  const {
    loadLocalStoreObjects,
    loadIPFSContracts,
    currentUser,
    currentNetwork,
    smartContracts,
    deployedContractObjects,
    contractObject,
    web3,
    createContract,
    changePortisNetwork,
  } = service
  const sidebarScroll = useRef()
  const contentScroll = useRef()
  useOnMount(async () => {
    sidebarScroll.current = new PerfectScrollbar('.sidebar')
    contentScroll.current = new PerfectScrollbar('.content')
    await loadLocalStoreObjects()
    await loadIPFSContracts()
  })

  const [deploymentSelection, updateDeploymentSelection] = useState({})
  const [selectedContractName, updateSelectedContractName] = useState(null)

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
        // connectProvider={loadWeb3}
        network={currentNetwork}
        account={currentUser}
      />
      <Sidebar
        deploymentSelection={deploymentSelection}
        network={currentNetwork}
        contracts={smartContracts}
        helpers={web3helpers}
        getDeployedContractObjects={deployedContractObjects}
        getContractObject={contractObject}
        updateContract={selectedContractName => {
          updateSelectedContractName(selectedContractName)
          updateDeploymentSelection({})
        }}
        updateDeploymentSelection={updateDeploymentSelection}
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
                loadIPFSContracts={loadIPFSContracts}
                uploadIPFS={uploadFiles}
                ipfsConfig={ipfsConfig}
                updateIPFSConfig={updateIpfsConfig}
              />
            )}
          />
          <Route exact path="/simulator" component={ContractSimulator} />
          <Route
            exact
            path="/settings"
            render={props => (
              <Settings
                {...props}
                portisNetworkChange={changePortisNetwork}
                ipfsConfig={ipfsConfig}
                loadIPFSContracts={loadIPFSContracts}
                uploadIPFS={uploadFiles()}
                updateIPFSConfig={updateIpfsConfig}
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
                helpers={web3helpers}
                network={currentNetwork}
                web3={web3}
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
                service={service}
                onDeploy={updateDeploymentSelection}
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
                getContractObject={contractObject}
                user={currentUser}
                createContract={createContract}
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
              service={service}
              selectedAddress={deploymentSelection.address}
            />
          )}
        />
      </Div>
    </Div>
  )
}

const Foo = () => <div />

export default withRouter(HomeComponent)
