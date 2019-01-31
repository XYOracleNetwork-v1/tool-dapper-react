import React from 'react'
import glam, { Div, Img } from 'glamorous'
import { Link, Route } from 'react-router-dom'

import { ReactComponent as Cog } from '../../assets/cog.svg'
import { ReactComponent as Registry } from '../../assets/registry-icon.svg'
import { ReactComponent as Upload } from '../../assets/upload.svg'
import { ReactComponent as W3 } from '../../assets/w3.svg'
import { ReactComponent as Simulator } from '../../assets/simulator.svg'
import SmartContractSelector from '../atoms/SmartContractSelector'
import { FunctionsList } from './FunctionsList'
import ContractAddressDropdown from '../atoms/ContractAddressDropdown'
import { lightPurple } from '../../theme'

const SidebarRoot = glam.div('sidebar', {
  display: `flex`,
  flexDirection: `column`,
  gridArea: 'sidebar',
  maxHeight: '100%',
  overflow: 'hidden',
  position: 'relative',
  color: '#fff',
  padding: 30,
  justifyContent: 'space-between',
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

const StyledLink = glam(Link)(
  {
    textDecoration: 'none',
    color: 'inherit',
    fontSize: 24,
    fontWeight: 'bold',
    cursor: 'pointer',
    padding: '20px 0',
    display: 'flex',
    alignItems: 'center',
    '& svg': {
      marginRight: 22,
      width: 22,
      fill: 'currentColor',
      stroke: 'currentColor',
    },
  },
  ({ active }) =>
    active && {
      color: lightPurple,
    },
)

const SidebarLink = ({ to, children, exact, ...props }) => (
  <Route
    path={to}
    exact={exact}
    children={({ match }) => (
      <StyledLink active={match} to={to} {...props}>
        {children}
      </StyledLink>
    )}
  />
)

const Sidebar = ({
  updateContract,
  updateDeploymentSelection,
  updateAddress,
  service,
  deploymentSelection,
}) => (
  <SidebarRoot>
    <Div>
      <SidebarLink to="/search">
        <Registry />
        ABI Search
      </SidebarLink>
      <SidebarLink to="/upload">
        <Upload />
        IPFS Uploader
      </SidebarLink>
      <SidebarLink to="/helpers">
        <W3 />
        Web3 Helpers
      </SidebarLink>
      <SidebarLink to="/simulator">
        <Simulator />
        Contract Simulator
      </SidebarLink>
      <Route
        path="/simulator/:contract?"
        render={props => (
          <SelectContractLayout>
            <SpaceBetweenRow>
              <SelectContractHeader>Select Contract</SelectContractHeader>
            </SpaceBetweenRow>
            <SmartContractSelector
              onSelect={updateContract}
              selectedContractName
              contracts={service.getSmartContracts()}
              {...props}
            />
            <ContractAddressDropdown
              onSelect={updateDeploymentSelection}
              service={service}
              selectedAddress={deploymentSelection.address}
              selectedNotes={deploymentSelection.notes}
              {...props}
            />
          </SelectContractLayout>
        )}
      />
      <Route
        path="/simulator/:contract"
        render={props => <FunctionsList {...props} service={service} />}
      />
    </Div>
    <Div>
      <SidebarLink to="/settings">
        <Cog />
        Settings
      </SidebarLink>
    </Div>
  </SidebarRoot>
)

export default Sidebar
