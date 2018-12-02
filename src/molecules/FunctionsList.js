import React from "react"
import glam, { Div, Img } from "glamorous"
import { NavLink as Link } from "react-router-dom"
import deploy from "../assets/deploy.svg"

import "./css/FunctionsList.css"

const FunctionsDiv = glam.div({
  flex: 1,
  overflow: `auto`,
})
const FunctionsHeaderDiv = glam.div({
  display: `flex`,
  flexDirection: `column`,
  justifyContent: `center`,
  height: 64,
  paddingLeft: 27,
  paddingTop: 10,
  borderBottom: `1px solid #979797`,
  width: `auto`,
})

const FunctionsListDiv = glam.div({
  display: `flex`,
  flexDirection: `column`,
  paddingTop: 33,
  lineHeight: `37px`,
  paddingLeft: 30,
})

export const getMethodSig = method => {
  return method.signature || `${method.name}${method.inputs.length}`
}

export const MethodLink = ({ match, method }) => (
  <Div css={{}}>
    <Link
      style={{ textDecoration: `none` }}
      className='method-link'
      activeClassName='active-method-link'
      to={`${match.url}/${getMethodSig(method)}`}
    >
      {method.name}
      ()
    </Link>
  </Div>
)

export const FunctionsList = props => {
  const { match, service } = props
  const contractName = match.params.contract
  const contract = service.contractObject(contractName)

  if (!contract || !contract.abi) {
    return null
  }
  /* eslint no-underscore-dangle: */
  const sortedMethods = []
  contract.abi
    // .sort((a, b) => (a.name && b.name ? a.name.localeCompare(b.name) : 1))
    .forEach((method, index) => {
      if (method.name && method.type === `function`) {
        sortedMethods.push(
          <MethodLink key={index} match={match} method={method} />,
        )
      }
      return sortedMethods
    })

  return (
    <FunctionsDiv>
      <FunctionsHeaderDiv>
        <Link style={{ textDecoration: `none` }} to={`/${contractName}/deploy`}>
          <Div
            css={{
              display: `flex`,
              justifyContent: `space-between`,
              paddingRight: `20px`,
            }}
          >
            <header className='header-functions'>Deploy Contract</header>
            <Img src={deploy} />
          </Div>
        </Link>
      </FunctionsHeaderDiv>
      <FunctionsHeaderDiv>
        <header className='header-functions'>Functions</header>
      </FunctionsHeaderDiv>

      <FunctionsListDiv>{sortedMethods}</FunctionsListDiv>
    </FunctionsDiv>
  )
}
