import React from 'react'
import glam, { Div, Img, A } from 'glamorous'
import CurNetwork from '../atoms/CurNetwork'
import logo from '../../assets/logo.svg'

const version = require(`../../../package.json`).version

const HeaderDiv = glam.div({
  display: `flex`,
  flexDirection: `row`,
  justifyContent: `space-between`,
  // backgroundColor: `#000`,
  paddingRight: 54,
  textAlign: `right`,
  gridArea: 'header',
})

class PageHeader extends React.Component {
  render() {
    const { connectProvider, network, account } = this.props
    const networkName = network && network.name
    return (
      <HeaderDiv>
        <Img css={{ width: 300, marginLeft: 60 }} src={logo} />
        <Div
          css={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            textAlign: 'right',
          }}
        >
          <A
            css={{ fontSize: 20, color: 'inherit' }}
            href="https://github.com/XYOracleNetwork/tool-dapper-react"
            target="_blank"
            rel="noopener noreferrer"
          >
            View on Github - {version}
          </A>
          <CurNetwork
            account={account}
            network={networkName}
            connectProvider={connectProvider}
          />
        </Div>
      </HeaderDiv>
    )
  }
}

export default PageHeader
