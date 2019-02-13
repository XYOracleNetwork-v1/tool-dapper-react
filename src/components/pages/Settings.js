import React, { Component, memo } from 'react'
import { Div, H2, Input } from 'glamorous'
import { STATE } from 'react-progress-button'
import glam from 'glamorous'

import { SettingsLayout } from '../molecules/SettingsComponenets'
import { readSettings } from '../../util/CookieReader'
import IPFSConfigForm from '../molecules/IPFSConfigForm'
import TextInput from '../atoms/TextInput'
import Button from '../atoms/Button'
import { web3Networks } from '../../util/SmartContractService'

const Heading = glam.h3({
  fontSize: 22,
  fontWeight: 'normal',
})

const RadioInput = props => <Input type="radio" {...props} />

class Settings extends Component {
  state = {
    ...readSettings(),
    updateBtnState: STATE.NOTHING,
  }

  stateChange = (stateKey, stateValue) => {
    console.log(`attempting State Change`, stateKey, stateValue)
    // Cookies.set(stateKey, stateValue, {
    //   path: `/`,
    // })
    this.setState({ [stateKey]: stateValue })
  }

  handleNetworkChange = changeEvent => {
    const val = changeEvent.target.value
    this.stateChange(`portisNetwork`, val)
    this.props.portisNetworkChange(val)
  }

  handleFormSubmit = async () => {
    const { ipfs } = this.state
    this.setState({ updateBtnState: STATE.LOADING })
    try {
      console.log({ ipfs })

      await this.props.loadIPFSContracts(ipfs)
      console.log({ ipfs })
      this.setState({ updateBtnState: STATE.SUCCESS })
    } catch (e) {
      this.setState({ ipfsError: e.toString(), updateBtnState: STATE.ERROR })
    }
  }

  renderNetworkRadio = () => {
    const curNetwork = this.state.portisNetwork
    console.log({ curNetwork, props: this.props })

    if (!curNetwork) return null

    return web3Networks
      .filter(({ id }) => id !== 0)
      .map(({ id, name, description }) => (
        <React.Fragment key={id}>
          <RadioInput
            css={{ marginRight: 10 }}
            id={id}
            name="web3-networks"
            value={name}
            checked={curNetwork === name}
            onChange={this.handleNetworkChange}
          />
          <label htmlFor={id}>{description}</label>
        </React.Fragment>
      ))
  }

  render() {
    const { ipfsConfig, updateIPFSConfig } = this.props
    const { ipfsError, updateBtnState } = this.state

    return (
      <SettingsLayout>
        <H2>Settings</H2>
        <Heading>IPFS Config</Heading>
        <IPFSConfigForm
          config={ipfsConfig}
          updateIPFSConfig={updateIPFSConfig}
        />
        <Heading>Portis Network</Heading>
        <Div
          css={{
            display: 'flex',
            justifyContent: 'space-between',
            maxWidth: 700,
          }}
        >
          {this.renderNetworkRadio()}
        </Div>
        <Heading>Add ABI</Heading>
        <Div css={{ display: 'flex', alignItems: 'center' }}>
          <TextInput
            css={{ marginRight: 40 }}
            label="IPFS Address"
            onChange={e => this.stateChange('ipfs', e.target.value)}
            id="ipfs"
            name="ipfs"
            placeholder="ie. QmRyaWmtHXByH1XzqNRmJ8uKLCqAbtem4bmfTdr7DmyxNJ"
          />
          <Button
            css={{
              display: 'block',
            }}
            state={updateBtnState}
            onClick={this.handleFormSubmit}
          >
            Add ABI
          </Button>
        </Div>
        <Div css={{ fontSize: 16, color: 'red' }}>{ipfsError}</Div>
      </SettingsLayout>
    )
  }
}

export default memo(Settings, (prevProps, nextProps) => {
  return prevProps.curNetwork === nextProps.curNetwork
})
