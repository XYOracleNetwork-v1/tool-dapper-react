import React, { Component } from "react"
import { Div, Input } from "glamorous"
import { withRouter } from "react-router-dom"
import { withCookies } from "react-cookie"
import { DetailsHeader, DetailsHeader2 } from "../atoms/DetailsHeader"
import {SettingsInput, RowLayout, InputText, CenterColumn, SettingsLayout} from "../molecules/SettingsComponenets"
import FolderDropzone from "./FolderDropzone"
import { readSettings } from "../atoms/CookieReader"
import ProgressButton, { STATE } from "react-progress-button"
import IPFSConfigDiv from '../molecules/IPFSConfigDiv'
const networkDescriptions = [
  { network: `development`, description: `Development (local)` },
  { network: `kovan`, description: `Kovan` },
  { network: `ropsten`, description: `Ropsten` },
  { network: `rinkeby`, description: `Rinkeby` },
  { network: `mainnet`, description: `Main Net` },
]



class Settings extends Component {
  constructor(props) {
    super(props)

    this.state = {
      ...readSettings(props.cookies),
      updateBtnState: STATE.NOTHING,
    }
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

  handleSourceSelect = changeEvent =>
    this.stateChange(`currentSource`, changeEvent.target.name)

  handleOptionChange = changeEvent =>
    this.stateChange(`currentSource`, changeEvent.target.value)

  handleNetworkChange = changeEvent => {
    this.stateChange(`portisNetwork`, changeEvent.target.value)
    this.props.portisNetworkChange(changeEvent.target.value)
  }

  handleFormSubmit = () => {
    this.setState({ updateBtnState: STATE.LOADING })
    return this.props.service
      .loadIPFSContracts(this.props.cookies)
      .then(_ => {
        this.setState({ updateBtnState: STATE.SUCCESS })
      })
  }

  radioInput = (value, checked, onChange) => (
    <Input
      style={{ display: `inline`, minWidth: `fit-content` }}
      type={`radio`}
      value={value}
      checked={checked}
      onChange={onChange}
    />
  )

  networkRadioInputs = () => {
    const inputs = []
    networkDescriptions.forEach(({ network, description }) => {
      inputs.push(
        <Div
          style={{ display: `inline`, minWidth: `fit-content` }}
          key={description}
        >
          {this.radioInput(
            network,
            this.state.portisNetwork === network,
            this.handleNetworkChange,
          )}
          {description}
        </Div>,
      )
    })
    return inputs
  }

  leftColumnDiv = (source, description) => (
    <InputText>
      {this.radioInput(
        source,
        this.state.currentSource === source,
        this.handleOptionChange,
      )}
      {description}
    </InputText>
  )

  centerColumnDiv = (source, value, placeholder) => (
    <CenterColumn css={{ display: `flex`, flexDirection: `row` }}>
      <SettingsInput
        css={{ minWidth: 320 }}
        type='text'
        value={value}
        name={source}
        placeholder={placeholder}
        onChange={this.handleChange}
        onSelect={this.handleSourceSelect}
      />
    </CenterColumn>
  )

  render() {
    return (
      <SettingsLayout>
        <DetailsHeader>Settings</DetailsHeader>
        <DetailsHeader2>IPFS Config</DetailsHeader2>
        <IPFSConfigDiv />
        <DetailsHeader2>Portis Network</DetailsHeader2>
        <RowLayout css={{ justifyContent: `space-between` }}>
          {this.networkRadioInputs()}
        </RowLayout>
        <DetailsHeader2>ABI Source</DetailsHeader2>
        <Div
          style={{
            margin: 40,
            display: `flex`,
            justifyContent: `center`,
            align: `center`,
            textAlign: `center`,
          }}
        >
          <FolderDropzone
            onSave={async ipfsHash => {
              this.stateChange(`ipfs`, ipfsHash)
              await this.props.service.loadIPFSContracts(this.props.cookies)
            }}
          />
        </Div>
        <RowLayout>
          {this.leftColumnDiv(`ipfs`, `IPFS Address`)}
          {this.centerColumnDiv(
            `ipfs`,
            this.state.ipfs,
            `ie. QmRyaWmtHXByH1XzqNRmJ8uKLCqAbtem4bmfTdr7DmyxNJ`,
          )}
          <Div>
            <ProgressButton
              style={{
                width: 200,
                marginLeft: 20,
              }}
              state={this.state.updateBtnState}
              onClick={this.handleFormSubmit}
            >
              Update IPFS
            </ProgressButton>
          </Div>
        </RowLayout>
      </SettingsLayout>
    )
  }
}

export default withCookies(withRouter(Settings))
