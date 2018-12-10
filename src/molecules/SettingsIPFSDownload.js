import React, { Component } from "react"
import { Div } from "glamorous"
import { HeaderStyle, HeaderStyle2 } from "../atoms/HeaderStyle"
import { withCookies } from "react-cookie"
import { withRouter } from "react-router-dom"

class SettingsIPFSDownload extends Component {
  state = {
    error: undefined,
  }
  componentDidMount() {
    let { ipfs } = this.props.match.params
    this.props.cookies.set(`ipfs`, ipfs, {
      path: `/`,
    })
    let { history } = this.props
    this.props.service
      .loadIPFSContracts(this.props.cookies)
      .then(_ => {
        history.push(`/settings`)
      })
      .catch(e => {
        this.setState({
          error: `Cannot Load IPFS, "${ipfs}", ${e.toString()}`,
        })
      })
  }
  render() {
    if (this.state.error) {
      return (
        <Div>
          <HeaderStyle2 style={{ color: `red` }}>
            {this.state.error}
          </HeaderStyle2>
        </Div>
      )
    }
    return (
      <Div>
        <HeaderStyle>Loading {this.props.match.params.ipfs}</HeaderStyle>
      </Div>
    )
  }
}

export default withRouter(withCookies(SettingsIPFSDownload))
