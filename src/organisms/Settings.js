import React, { Component } from "react"
import { Div, Input } from "glamorous"
import { withRouter } from "react-router-dom"
import { withCookies } from "react-cookie"
import { HeaderStyle, HeaderStyle2 } from "../atoms/HeaderStyle"
import {
  SettingsInput,
  RowLayout,
  InputText,
  CenterColumn,
  SettingsLayout,
} from "../molecules/SettingsComponenets"
import FolderDropzone from "./FolderDropzone"
import { readSettings } from "../atoms/CookieReader"
import ProgressButton, { STATE } from "react-progress-button"
import IPFSConfigDiv from "../molecules/IPFSConfigDiv"

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
    return this.props.service.loadIPFSContracts(this.props.cookies).then(_ => {
      this.setState({ updateBtnState: STATE.SUCCESS })
    })
  }

  radioInput = (value, checked, onChange) => (
    <Input type={`radio`} value={value} checked={checked} onChange={onChange} />
  )

  networkRadioInputs = () => {
    const inputs = []
    let curNetwork = this.state.portisNetwork
    if (curNetwork) {
      const networks = this.props.service.getWeb3Networks()
      networks.forEach((network) => {
        let { id, name, description } = network
        if (id !== 0) {
          // console.log(
          //   `Updating radio buttons`,
          //   id,
          //   name,
          //   curNetwork,
          //   curNetwork === network,
          // )
          inputs.push(
            <Div style={{ display: `inline`, margin: 10 }} key={id}>
              {this.radioInput(
                name,
                curNetwork === name,
                this.handleNetworkChange,
              )}
              {description}
            </Div>,
          )
        }
        
      })
    }

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
    <CenterColumn css={{}}>
      <SettingsInput
        style={{ minWidth: 350 }}
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
        <HeaderStyle>Settings</HeaderStyle>
        <HeaderStyle2>IPFS Config</HeaderStyle2>
        <IPFSConfigDiv />
        <HeaderStyle2>Portis Network</HeaderStyle2>
        <RowLayout css={{ justifyContent: `space-between`, maxWidth: 700 }}>
          {this.networkRadioInputs()}
        </RowLayout>
        <HeaderStyle2>ABI Source</HeaderStyle2>
        <Div
          style={{
            marginBottom: 40,
            marginLeft: 100,
            display: `flex`,
            justifyContent: `left`,
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
