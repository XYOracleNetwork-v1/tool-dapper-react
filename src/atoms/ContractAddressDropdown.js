import React, { Component } from "react"
import { Div } from "glamorous"
import { Route, withRouter } from "react-router-dom"
import Dropdown from "react-dropdown"
import "react-dropdown/style.css"
import "./css/SmartContractSelector.css"

class ContractAddressDropdown extends Component {
  state = {
    selected: this.props.selected,
  }

  _onSelect = selection => {
    this.props.onSelect(selection.value)
  }

  dropdownDiv = () => {
    let contractObjects = this.props.contractObjects
    if (!contractObjects || contractObjects.length === 0) {
      return <Div>No Contracts Deployed</Div>
    } else if (contractObjects.length == 1) {
      return <Div>Address: {contractObjects[0].address}</Div>
    }
    return (
      <Dropdown
        options={contractObjects.map(obj => {
          return {
            value: obj.address,
            label: `${obj.address.substring(0, 19)}...`,
          }
        })}
        onChange={this._onSelect}
        value={this.props.selected || contractObjects[0].address}
        placeholder='Nothing Selected'
      />
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

export default withRouter(ContractAddressDropdown)
