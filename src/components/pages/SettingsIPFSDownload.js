import React, { Component } from 'react'
import { Div } from 'glamorous'
import { HeaderStyle, HeaderStyle2 } from '../atoms/HeaderStyle'
import Cookies from 'js-cookie'
import { withRouter } from 'react-router-dom'

class SettingsIPFSDownload extends Component {
  state = {
    error: undefined,
  }

  componentDidMount() {
    const {
      match: {
        params: { ipfs },
      },
      service,
      history,
    } = this.props
    Cookies.set(`ipfs`, ipfs, {
      path: `/`,
    })
    service
      .loadIPFSContracts()
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
    const {
      match: {
        params: { ipfs },
      },
    } = this.props
    const { error } = this.state
    if (error) {
      return (
        <Div>
          <HeaderStyle2 style={{ color: `red` }}>{error}</HeaderStyle2>
        </Div>
      )
    }
    return (
      <Div>
        <HeaderStyle>Loading {ipfs}</HeaderStyle>
      </Div>
    )
  }
}

export default withRouter(SettingsIPFSDownload)
