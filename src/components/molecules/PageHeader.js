import React from 'react'
import glam, { Div, Img } from 'glamorous'
import CurNetwork from '../atoms/CurNetwork'
import logo from '../../assets/dapper-logo.svg'

const version = require(`../../../package.json`).version

const HeaderDiv = glam.div({
  display: `flex`,
  flexDirection: `row`,
  justifyContent: `space-between`,
  backgroundColor: `#000`,
  paddingRight: 54,
  textAlign: `right`,
  gridArea: 'header',
})

class PageHeader extends React.Component {
  render() {
    let network = this.props.service.getCurrentNetwork()
      ? this.props.service.getCurrentNetwork().name
      : ``
    return (
      <HeaderDiv>
        <Img className="image-header-logo" src={logo} />
        <Div className="vertical-center">
          <a
            href="https://github.com/XYOracleNetwork/tool-dapper-react"
            className="link-right"
            target="_blank"
            rel="noopener noreferrer"
          >
            View on Github - {version}
          </a>
          <CurNetwork
            account={this.props.service.getCurrentUser()}
            network={network}
          />
        </Div>
      </HeaderDiv>
    )
  }
}

export default PageHeader
