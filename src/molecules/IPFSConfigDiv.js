import React, { Component } from "react"
import { SettingsInput, RowLayout, InputText } from "./SettingsComponenets"
import { withCookies } from "react-cookie"
import { ipfsConfigFromCookies } from "../organisms/IPFSUploader"

class IPFSConfigDiv extends Component {
  constructor(props) {
    super(props)
    this.state = ipfsConfigFromCookies(props.cookies)
  }
  handleChange = changeEvent => {
    this.stateChange(changeEvent.target.name, changeEvent.target.value)
  }
  stateChange = (stateKey, stateValue) => {
    console.log(`attempting State Change`, stateKey, stateValue)
    this.props.cookies.set(stateKey, stateValue, {
      path: `/`,
    })
    const newState = this.state
    newState[stateKey] = stateValue

    this.setState(newState)
  }
  render() {
    return (
      <RowLayout>
        <InputText>Host</InputText>
        <SettingsInput
          type='text'
          value={this.state.ipfshost}
          name={`ipfshost`}
          placeholder={`127.0.0.1`}
          onChange={this.handleChange}
          onSelect={this.handleSourceSelect}
        />
        <InputText>Port</InputText>

        <SettingsInput
          type='text'
          value={this.state.ipfsport}
          name={`ipfsport`}
          placeholder={`5002`}
          onChange={this.handleChange}
          onSelect={this.handleSourceSelect}
        />
        <InputText>Protocol</InputText>

        <SettingsInput
          type='text'
          value={this.state.ipfsprotocol}
          name={`ipfsprotocol`}
          placeholder={`https`}
          onChange={this.handleChange}
          onSelect={this.handleSourceSelect}
        />
      </RowLayout>
    )
  }
}

export default withCookies(IPFSConfigDiv)
