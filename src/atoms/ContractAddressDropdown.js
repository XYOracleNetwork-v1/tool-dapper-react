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
    if (!this.state.selected || this.state.selected.label !== selection.label) {
      this.setState({ selected: selection })
    }
    console.log(`History`, this.props.history)
    this.props.history.push(`/${selection.label}`)
  }

  dropdownDiv = (contractName, contractObjects) => {
    if (!contractName) {
      return <Div>No Contract Selected</Div>
    }
    if (!contractObjects || contractObjects.length === 0) {
      return <Div>No Contracts Deployed</Div>
    } else if (contractObjects.length == 1) {
      console.log(contractObjects)
      return <Div>Address: {contractObjects[0].address}</Div>
    }
    return (
      <Dropdown
        options={contractObjects.map(obj => {
          return {
            value: obj.address,
            label: `${obj.address.substring(0, 15)}...`,
          }
        })}
        onChange={this._onSelect}
        value={this.state.selected}
        placeholder='Nothing Selected'
      />
    )
  }

  render() {
    return (
      <Route
        path='/:contract'
        render={routeProps => {
          const match = routeProps.match
          const contractName = match.params.contract

          const contractObjects = this.props.service.currentDeployedContractObjects(
            contractName,
          )
          return (
            <Div
              css={{
                marginTop: 25,
                fontFamily: `PT Sans`,
              }}
            >
              {this.dropdownDiv(contractName, contractObjects)}
            </Div>
          )
        }}
      />
    )
  }
}

export default withRouter(ContractAddressDropdown)
