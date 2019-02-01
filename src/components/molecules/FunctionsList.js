import React from 'react'
import glam, { Div, Img } from 'glamorous'
import { NavLink as Link, Route } from 'react-router-dom'

import { ReactComponent as Deploy } from '../../assets/deploy.svg'
import { ReactComponent as FunctionsIcon } from '../../assets/functions-icon.svg'
import { ReactComponent as FunctionIcon } from '../../assets/function-icon.svg'
import './css/FunctionsList.css'
import { lightPurple } from '../../theme'

const FunctionsDiv = glam.div({
  // flex: 1,
  // overflow: `auto`,
})
const FunctionsHeaderDiv = glam.div(
  {
    display: `flex`,
    alignItems: 'center',
    margin: '10px 0',
    '& svg': {
      marginRight: 15,
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

const FunctionsListDiv = glam.div({
  marginLeft: 8,
})

const NavItem = glam.div({
  fontSize: 25,
})

const StyledLink = glam(Link)(
  {
    textDecoration: 'none',
    color: 'inherit',
    fontSize: 20,
    fontWeight: 'bold',
    cursor: 'pointer',
    padding: '20px 0',
    display: 'flex',
    alignItems: 'center',
    margin: '10px 0',
    '& svg': {
      marginRight: 15,
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

const StyledMethodLink = glam(Link)(
  {
    textDecoration: 'none',
    fontSize: 18,
    // lineHeight: '2.17px',
    color: '#fff',
    cursor: 'pointer',
    padding: '10px 0',
    display: 'flex',
    alignItems: 'center',
    marginLeft: 30,
    '& svg': {
      marginRight: 15,
      width: 15,
      fill: 'currentColor',
      stroke: 'currentColor',
    },
  },
  ({ active }) =>
    active && {
      fontWeight: 'bold',
      color: lightPurple,
      marginLeft: 0,
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

export const getMethodSig = method => {
  return method.signature || `${method.name}${method.inputs.length}`
}

export const MethodLink = ({ url, method, exact }) => {
  const to = `${url}/${getMethodSig(method)}`
  return (
    <Route
      path={to}
      exact={exact}
      children={({ match }) => (
        <StyledMethodLink to={to} active={match}>
          {match && <FunctionIcon />}
          {method.name}()
        </StyledMethodLink>
      )}
    />
  )
}

export const FunctionsList = ({ match, service }) => {
  const contractName = match.params.contract
  const contract = service.contractObject(contractName)

  if (!contract || !contract.abi) {
    return null
  }
  /* eslint no-underscore-dangle: */
  const sortedMethods = contract.abi
    .filter(({ name, type }) => name && type === 'function')
    // .sort((a, b) => (a.name && b.name ? a.name.localeCompare(b.name) : 1))
    .map((method, index) => (
      <MethodLink key={index} url={match.url} method={method} />
    ))

  return (
    <FunctionsDiv>
      <SidebarLink to={`/simulator/${contractName}/deploy`}>
        <Deploy />
        <NavItem>Deploy Contract</NavItem>
      </SidebarLink>
      <Route
        path="/simulator/:contract/:function"
        render={({ match }) => (
          <FunctionsHeaderDiv active={match}>
            <FunctionsIcon />
            <NavItem>Functions</NavItem>
          </FunctionsHeaderDiv>
        )}
      />

      <FunctionsListDiv>{sortedMethods}</FunctionsListDiv>
      <SidebarLink to="/dappHelpers">
        <Deploy />
        <NavItem>Dapp Helpers</NavItem>
      </SidebarLink>
    </FunctionsDiv>
  )
}
