import React, { Component } from "react"
import glam, { Div } from "glamorous"
import { withRouter } from "react-router-dom"
import Dropdown from "react-dropdown"
import "react-dropdown/style.css"
import "./css/SmartContractSelector.css"
import ProgressButton, { STATE } from "react-progress-button"
import { withCookies } from "react-cookie"

const GreyTopped = glam.div({
  paddingTop: 10,
  color: `#c8c8c8`,
})

class ContractAddressDropdown extends Component {
  state = {
    selectedNotes: this.props.selectedNotes,
    selectedAddress: this.props.selectedAddress,
    connectButtonState: STATE.NOTHING,
  }

  _onSelect = selection => {
    console.log(`Detected Selection`)
    let {contractObjects} = this.props
    // let contractObjects = this.props.fetchObjects()
    contractObjects.forEach(obj => {
      if (obj.address === selection.value || obj.notes === selection.value) {
        this.props.onSelect({ notes: obj.notes, address: obj.address })
        return
      }
    })
  }

  getOptionValue = contractObject => {
    let val = contractObject.notes || contractObject.address
    return val.length > 20 ? `${val.substring(0, 20)}...` : val
  }

  connectProvider = async () => {
    this.props.service
      .loadWeb3(this.props.cookies).then(() => {
        console.log(`Dropdown finish connectg`, this.props.service.getWeb3Networks())
      })
      // .then(this.setState({ connectButtonState: STATE.SUCCESS }))
  }
    
  

  dropdownDiv = () => {
    // let contractObjects = this.props.fetchObjects()
    let { contractObjects } = this.props
    console.log(`RENDERING ADDRESS DROPDOWN WITH OBJ`, contractObjects)
    let network = this.props.service.getCurrentNetwork()
    if (!network) {
      return (
        <ProgressButton
          style={{
            width: 260,
            marginTop: 10,
            color: `white`,
          }}
          state={this.state.connectButtonState}
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
          options={contractObjects.map(obj => {
            let val = this.getOptionValue(obj)
            return {
              value: obj.notes || obj.address,
              label: val,
            }
          })}
          onChange={this._onSelect}
          value={
            this.props.selectedNotes
              ? this.props.selectedNotes
              : this.props.selectedAddress
          }
          placeholder='Nothing Selected'
        />
      </Div>
    )
  }

  addressCopyDiv = () => {
    if (this.props.selectedAddress) {
      return <Div>Address: {this.props.selectedAddress}</Div>
    }
    return null
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
