import React from 'react'
import glam, { Div } from 'glamorous'
import { NavLink as Link } from 'react-router-dom'
import { contractNamed } from '../web3'
import './css/FunctionsList.css'

const FunctionsDiv = glam.div({
  flex: 1,
  overflow: 'auto',
})
const FunctionsHeaderDiv = glam.div({
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  height: 78,
  paddingLeft: 37,
  borderBottom: '1px solid #979797',
})
const FunctionsListDiv = glam.div({
  display: 'flex',
  flexDirection: 'column',
  paddingTop: 33,
  lineHeight: '37px',
  paddingLeft: 77,
  backgroundColor: '#F8F8F8',
  height: '100%',
})

export const MethodLink = ({ match, method }) => (
  <Div key={method.signature} css={{}}>
    <Link
      className="method-link"
      activeClassName="active-method-link"
      style={{
        lineHeight: '35px',
        color: '#9d9d9d',
        textDecoration: 'none',
        fontSize: 18,
      }}
      activeStyle={{
        color: 'purple',
      }}
      to={`${match.url}/${method.signature}`}
    >
      {' '}
      {method.name}
      (){' '}
    </Link>
  </Div>
)

export const FunctionsList = props => {
  const { match } = props
  const contractName = match.params.contract
  const contract = contractNamed(contractName)
  if (!contract) {
    return null
  }
  /* eslint no-underscore-dangle: */
  const sortedMethods = contract._jsonInterface
    .sort((a, b) => (a.name && b.name ? a.name.localeCompare(b.name) : 0))
    .map(method => {
      if (method.name && method.type === 'function') {
        return (
          <MethodLink key={method.signature} match={match} method={method} />
        )
      }
      return undefined
    })

  return (
    <FunctionsDiv>
      <FunctionsHeaderDiv>
        <header className="header-functions">Functions</header>
      </FunctionsHeaderDiv>

      <FunctionsListDiv>{sortedMethods}</FunctionsListDiv>
    </FunctionsDiv>
  )
}
