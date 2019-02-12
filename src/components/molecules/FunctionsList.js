import React from 'react'
import glam, { Div, Img } from 'glamorous'
import { Route } from 'react-router-dom'

import { ReactComponent as Deploy } from '../../assets/deploy.svg'
import { ReactComponent as FunctionsIcon } from '../../assets/functions-icon.svg'
import { ReactComponent as FunctionIcon } from '../../assets/function-icon.svg'
import { lightPurple } from '../../theme'
import Link from '../atoms/Link'

const FunctionsDiv = glam.div({
  // flex: 1,
  // overflow: `auto`,
  marginLeft: 20,
})

const FunctionsHeaderDiv = glam.div(
  {
    display: `flex`,
    alignItems: 'center',
    margin: '10px 0',
    marginLeft: 25,
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
  fontSize: 22,
})

const StyledLink = glam(Link)({
  textDecoration: 'none',
  paddingLeft: 25,
  display: 'flex',
  alignItems: 'center',
  ':hover': {
    background: 'rgba(0,0,0,0.1)',
  },
  '& svg': {
    marginRight: 15,
    fill: 'currentColor',
    stroke: 'currentColor',
  },
})

const StyledSectionLink = glam(StyledLink)(
  {
    paddingTop: 20,
    paddingBottom: 20,
    margin: '10px 0',
    '& svg': {
      width: 22,
    },
  },
  ({ active }) =>
    active && {
      color: lightPurple,
    },
)

const StyledMethodLink = glam(StyledLink)(
  {
    paddingTop: 10,
    paddingBottom: 10,
    paddingLeft: 55,
    '& svg': {
      width: 15,
    },
  },
  ({ active }) =>
    active && {
      fontWeight: 'bold',
      color: lightPurple,
      marginLeft: 0,
      paddingLeft: 25,
    },
)

const SidebarLink = ({ to, children, exact, ...props }) => (
  <Route
    path={to}
    exact={exact}
    children={({ match }) => (
      <StyledSectionLink active={match} to={to} {...props}>
        {children}
      </StyledSectionLink>
    )}
  />
)

export const getMethodSig = method => {
  return method.signature || `${method.name}${method.inputs.length}`
}

export const MethodLink = ({ url, method, exact }) => {
  const to = `${url}/functions/${getMethodSig(method)}`
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

export const FunctionsList = ({
  match: {
    params: { contract: contractName },
    url,
  },
  getContractObject,
}) => {
  const contract = getContractObject(contractName)

  if (!contract || !contract.abi) {
    return null
  }
  /* eslint no-underscore-dangle: */
  const sortedMethods = contract.abi
    .filter(({ name, type }) => name && type === 'function')
    // .sort((a, b) => (a.name && b.name ? a.name.localeCompare(b.name) : 1))
    .map((method, index) => (
      <MethodLink key={index} url={url} method={method} />
    ))

  return (
    <FunctionsDiv>
      <SidebarLink to={`/simulator/${contractName}/deploy`}>
        <Deploy />
        <NavItem>Deploy Contract</NavItem>
      </SidebarLink>
      <Route
        path="/simulator/:contract/functions/:function"
        children={({ match }) => (
          <FunctionsHeaderDiv active={match}>
            <FunctionsIcon />
            <NavItem>Functions</NavItem>
          </FunctionsHeaderDiv>
        )}
      />

      <FunctionsListDiv>{sortedMethods}</FunctionsListDiv>
    </FunctionsDiv>
  )
}
