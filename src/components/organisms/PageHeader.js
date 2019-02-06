import React from 'react'
import glam, { Div, Img, A } from 'glamorous'
import CurrentNetwork from '../atoms/CurrentNetwork'
import logo from '../../assets/logo.svg'
import Anchor from '../atoms/Anchor'

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
          <Anchor
            css={{ fontSize: 20 }}
            href="https://github.com/XYOracleNetwork/tool-dapper-react"
            target="_blank"
            rel="noopener noreferrer"
          >
            View on Github - {version}
          </Anchor>
          <CurrentNetwork
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
