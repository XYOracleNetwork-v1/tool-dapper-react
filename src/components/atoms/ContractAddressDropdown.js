import React, { Component } from 'react'
import glam, { Div } from 'glamorous'
import { withRouter } from 'react-router-dom'
import Dropdown from 'react-dropdown'
import 'react-dropdown/style.css'
import './css/SmartContractSelector.css'
import ProgressButton, { STATE } from 'react-progress-button'
import { withCookies } from 'react-cookie'

const GreyTopped = glam.div({
  paddingTop: 10,
  color: `#c8c8c8`,
})

class ContractAddressDropdown extends Component {
  state = {
    connectButtonState: STATE.NOTHING,
  }

  fetchObjects = () => {
    const {
      service,
      match: {
        params: { contract },
      },
    } = this.props
    return service.deployedContractObjects(contract) || []
  }

  _onSelect = selection => {
    const contractObjects = this.fetchObjects()
    contractObjects.forEach(obj => {
      if (obj.address === selection.value || obj.notes === selection.value) {
        this.props.onSelect({ notes: obj.notes, address: obj.address })
        return
      }
    })
  }

  getOptionValue = val => (val.length > 20 ? `${val.substring(0, 20)}...` : val)

  connectProvider = async () => {
    this.props.service.loadWeb3(this.props.cookies)
  }

  dropdownDiv = () => {
    const { service, selectedNotes, selectedAddress } = this.props
    const { connectButtonState } = this.state
    const contractObjects = this.fetchObjects()
    let network = service.getCurrentNetwork()
    if (!network) {
      return (
        <ProgressButton
          style={{
            width: 260,
            marginTop: 10,
            color: `white`,
          }}
          state={connectButtonState}
          onClick={this.connectProvider}
        >
          Connect Wallet
        </ProgressButton>
      )
    }

    if (!contractObjects || contractObjects.length === 0) {
      return <GreyTopped>Not deployed on {network.name}</GreyTopped>
    }
    return (
      <Div>
        <Dropdown
          options={contractObjects.map(({ notes, address }) => {
            const value = notes || address
            let val = this.getOptionValue(value)
            return {
              value,
              label: val,
            }
          })}
          onChange={this._onSelect}
          value={selectedNotes || selectedAddress}
          placeholder="Nothing Selected"
        />
      </Div>
    )
  }

  render() {
    return (
      <Div
        css={{
          marginTop: 25,
          fontFamily: `PT Sans`,
        }}
      >
        {this.dropdownDiv()}
      </Div>
    )
  }
}

export default withCookies(withRouter(ContractAddressDropdown))
