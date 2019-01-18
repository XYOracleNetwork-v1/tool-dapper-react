import React from 'react'
import glam, { Div, Img } from 'glamorous'
import { Link, Route } from 'react-router-dom'

import cog, { ReactComponent as Cog } from '../assets/cog.svg'
import { ReactComponent as Registry } from '../assets/registry-icon.svg'
import { ReactComponent as Upload } from '../assets/upload.svg'
import { ReactComponent as W3 } from '../assets/w3.svg'
import { ReactComponent as Simulator } from '../assets/simulator.svg'
import SmartContractSelector from '../atoms/SmartContractSelector'
import { FunctionsList } from './FunctionsList'
import ContractAddressDropdown from '../atoms/ContractAddressDropdown'

const SidebarRoot = glam.div('sidebar', {
  display: `flex`,
  flexDirection: `column`,
  gridArea: 'sidebar',
  maxHeight: '100%',
  overflow: 'hidden',
  position: 'relative',
  color: '#fff',
  padding: 30,
})

const SelectContractLayout = glam.div({
  display: `flex`,
  flexDirection: `column`,
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

const SidebarItem = glam.div({
  fontSize: 24,
  fontWeight: 'bold',
  cursor: 'pointer',
  padding: '20px 0',
  display: 'flex',
  alignItems:'center',
  '& svg': {
    marginRight: 22,
    width: 22,
  },
})

const Sidebar = ({
                   updateContract,
                   updateDeploymentSelection,
                   contractObjects,
                   updateAddress,
                   service,
                   deploymentSelection,
                 }) => (
  <SidebarRoot>
    <SidebarItem>
      <Registry/>
      ABI Search
    </SidebarItem>
    <SidebarItem>
      <Upload/>
      IPFS Uploader
    </SidebarItem>
    <SidebarItem>
      <W3/>
      Web3 Helpers
    </SidebarItem>
    <SidebarItem>
      <Simulator/>
      Contract Simulator
    </SidebarItem>
    <SidebarItem>
      <Cog/>
      Settings
    </SidebarItem>
    <SelectContractLayout>
      <SpaceBetweenRow>
        <SelectContractHeader>Select Contract</SelectContractHeader>
        <Link to={`/settings`}>
          <Img src={cog}/>
        </Link>
      </SpaceBetweenRow>
      <SmartContractSelector
        onSelect={updateContract}
        selectedContractName
        contracts={service.getSmartContracts()}
      />
      <ContractAddressDropdown
        onSelect={updateDeploymentSelection}
        contractObjects={contractObjects}
        service={service}
        selectedAddress={deploymentSelection.address}
        selectedNotes={deploymentSelection.notes}
      />
    </SelectContractLayout>
    <Route
      path="/:contract"
      render={props => <FunctionsList {...props} service={service}/>}
    />
  </SidebarRoot>
)

export default Sidebar
