import React from 'react'
import glam, { Div } from 'glamorous'
import { Route } from 'react-router-dom'

import { ReactComponent as FunctionIcon } from '../../assets/function-icon.svg'
import { lightPurple } from '../../theme'
import Link from '../atoms/Link'

const FunctionsDiv = glam.div({
  // flex: 1,
  // overflow: `auto`,
  // marginLeft: 20,
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

export const MethodLink = ({ to, children, exact }) => {
  return (
    <Route
      path={to}
      exact={exact}
      children={({ match }) => (
        <StyledMethodLink to={to} active={match}>
          {match && <FunctionIcon />}
          {children}
        </StyledMethodLink>
      )}
    />
  )
}

export const Web3HelpersList = ({
  match: {
    params: { contract: contractName },
    url,
  },
  helpers,
}) => (
  <Div css={{ marginLeft: 20 }}>
    {helpers.map(func => (
      <MethodLink key={func.name} to={`/helpers/${func.id}`}>
        {func.name}()
      </MethodLink>
    ))}
  </Div>
)
