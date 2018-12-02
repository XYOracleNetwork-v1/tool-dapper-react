import React, { Component } from "react"
import glam, { Div } from "glamorous"
import { withRouter } from "react-router-dom"
import Dropdown from "react-dropdown"
import "react-dropdown/style.css"
import "./css/SmartContractSelector.css"

const GreyTopped = glam.div({
  paddingTop: 10,
  color: `#c8c8c8`,
})

class ContractAddressDropdown extends Component {
  state = {
    selectedNotes: this.props.selectedNotes,
    selectedAddress: this.props.selectedAddress,
  }

  _onSelect = selection => {
    console.log(`Detected Selection`)
    let contractObjects = this.props.fetchObjects()
    contractObjects.forEach(obj => {
      if (obj.address == selection.value || obj.notes == selection.value) {
        console.log(`Found Selected Object`, obj)

        this.props.onSelect({ notes: obj.notes, address: obj.address })
        return
      }
    })
  }

  getOptionValue = contractObject => {
    let val = contractObject.notes || contractObject.address
    return val.length > 20 ? `${val.substring(0, 20)}...` : val
  }

  showSelectedDiv = () => {
    if (this.props.selectedAddress) {
      return (
        <GreyTopped>
          <Div>{this.props.selectedAddress}</Div>
        </GreyTopped>
      )
    }
    return null
  }

  dropdownDiv = () => {
    let contractObjects = this.props.fetchObjects()

    if (!contractObjects || contractObjects.length === 0) {
      return <GreyTopped>No Contracts Deployed</GreyTopped>
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
        {this.showSelectedDiv()}
      </Div>
    )
  }
}

export default withRouter(ContractAddressDropdown)
