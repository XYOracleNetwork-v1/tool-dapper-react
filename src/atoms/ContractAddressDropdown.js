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

  getOptionValue = contractObject => {
    return contractObject.notes || this.props.selected || contractObject.address
  }

  dropdownDiv = () => {
    let contractObjects = this.props.contractObjects

    if (!contractObjects || contractObjects.length === 0) {
      return <Div>No Contracts Deployed</Div>
    }
    let value = this.getOptionValue(contractObjects[0])

    if (contractObjects.length == 1) {
      let result = [<Div>Address: {contractObjects[0].address}</Div>]
      if (contractObjects[0].notes !== ``) {
        result.push(<Div>Deployment Notes: {contractObjects[0].notes}</Div>)
      }
      return <Div>{result}</Div>
    }
    return (
      <Dropdown
        options={contractObjects.map(obj => {
          let val = this.getOptionValue(obj)
          val = val.length > 20 ? val.substring(0, 20) : val
          return {
            value: obj.address,
            label: val,
          }
        })}
        onChange={this._onSelect}
        value={value}
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
