import React, { Component } from 'react'
import { Div } from 'glamorous'
import { withRouter } from 'react-router-dom'
import Dropdown from 'react-dropdown'
import 'react-dropdown/style.css'
import './css/SmartContractSelector.css'

class SmartContractSelector extends Component {
  state = {
    contracts: this.props.contracts,
    selected: null,
    contractsChanged: undefined,
  }

  _onSelect = contract => {
    if (!this.state.selected || this.state.selected.label !== contract.label) {
      this.setState({ selected: contract })
    }
    this.props.history.push(`/${contract.label}`)
  }

  render() {
    let selected = undefined
    let options = this.props.contracts.map(contract => {
      let contractOption = {
        value: contract.name,
        label: contract.name,
      }
      if (
        this.props.history.location.pathname &&
        this.props.history.location.pathname.slice(1).startsWith(contract.name)
      ) {
        selected = contractOption
      }
      return contractOption
    })

    return (
      <Div
        css={{
          margin: 10,
          height: 20,
          display: 'flex',
          flexDirection: 'column',
          textAlign: 'left',
        }}
      >
        <Dropdown
          css={{
            height: 60,
            fontFamily: 'PT Sans',
          }}
          options={options}
          onChange={this._onSelect}
          value={selected}
          placeholder="Nothing Selected"
        />
      </Div>
    )
  }
}

export default withRouter(SmartContractSelector)
