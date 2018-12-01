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
    selected: this.props.selected,
  }

  _onSelect = selection => {
    this.props.onSelect(selection.value)
  }

  getOptionValue = contractObject => {
    let val = contractObject.notes || contractObject.address
    return val.length > 20 ? `${val.substring(0, 20)}...` : val
  }

  showSelectedDiv = () => {
    if (this.props.selected) {
      return (
        <GreyTopped>
          <Div>{this.props.selected}</Div>
        </GreyTopped>
      )
    }
    return null
  }

  dropdownDiv = () => {
    let contractObjects = this.props.contractObjects

    if (!contractObjects || contractObjects.length === 0) {
      return <GreyTopped>No Contracts Deployed</GreyTopped>
    }
    let value = this.getOptionValue(contractObjects[0])

    if (contractObjects.length == 1) {
      let result = []
      if (contractObjects[0].notes !== ``) {
        result.push(<Div>Notes: {contractObjects[0].notes}</Div>)
      }
      result.push(<Div>{contractObjects[0].address}</Div>)
      return <GreyTopped>{result}</GreyTopped>
    }
    return (
      <Div>
        <Dropdown
          options={contractObjects.map(obj => {
            let val = this.getOptionValue(obj)
            return {
              value: obj.address,
              label: val,
            }
          })}
          onChange={this._onSelect}
          value={this.props.selected}
          placeholder='Nothing Selected'
        />
        {this.showSelectedDiv()}
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
        <Div>
          {() => {
            if (this.state.selected) {
              return <Div>Address: {this.state.selectedAddress}</Div>
            }
          }}
        </Div>
      </Div>
    )
  }
}

export default withRouter(ContractAddressDropdown)
