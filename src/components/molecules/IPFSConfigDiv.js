import React, { Component } from 'react'
import { withCookies } from 'react-cookie'
import glam, { Div, Form } from 'glamorous'

import { ipfsConfigFromCookies } from '../../util/IPFSUploader'
import TextInput from '../atoms/TextInput'
import Button from '../atoms/Button'

class IPFSConfigDiv extends Component {
  state = ipfsConfigFromCookies(this.props.cookies)

  handleChange = evt => {
    // maybe don't update cookies on each change, only on save
    // this.props.cookies.set(stateKey, stateValue, {
    //   path: `/`,
    // })
    this.setState({ [evt.target.name]: evt.target.value })
  }

  handleSubmit = e => {
    e.preventDefault()
    Object.entries(this.state).forEach(([stateKey, stateValue]) => {
      this.props.cookies.set(stateKey, stateValue, {
        path: `/`,
      })
    })
  }

  render() {
    const { ipfshost, ipfsport, ipfsprotocol } = this.state
    return (
      <Form id="ipfs-config-form" onSubmit={this.handleSubmit}>
        <Div css={{ display: 'flex', marginBottom: 25 }}>
          <TextInput
            onChange={this.handleChange}
            value={ipfshost}
            label="Host"
            id="ipfshost"
            placeholder="ipfs.xyo.network"
          />
          <TextInput
            onChange={this.handleChange}
            value={ipfsport}
            label="Port"
            id="ipfsport"
            placeholder="5002"
          />
          <TextInput
            onChange={this.handleChange}
            value={ipfsprotocol}
            label="Protocol"
            id="ipfsprotocol"
            placeholder="https"
          />
        </Div>
        <Button type="submit">Save</Button>
      </Form>
    )
  }
}

export default withCookies(IPFSConfigDiv)
