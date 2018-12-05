import React from "react"
import glam, { Div, Img } from "glamorous"
import CurNetwork from "../atoms/CurNetwork"
import logo from "../assets/dapper-logo.svg"
const version = require(`../../package.json`).version

const HeaderDiv = glam.div({
  display: `flex`,
  flexDirection: `row`,
  justifyContent: `space-between`,
  backgroundColor: `#3c3e51`,
  paddingRight: 54,
  height: 113,
  textAlign: `right`,
})

class PageHeader extends React.Component {
  render() {
    return (
      <HeaderDiv>
        <Img className='image-header-logo' src={logo} />
        <Div className='vertical-center'>
          <a
            href='https://github.com/XYOracleNetwork/tool-dapper-react'
            className='link-right'
            target='_blank'
            rel='noopener noreferrer'
          >
            View on Github - {version}
          </a>
          <CurNetwork
            account={this.props.service.getCurrentUser()}
            network={this.props.service.getCurrentNetwork()}
          />
        </Div>
      </HeaderDiv>
    )
  }
}

export default PageHeader
