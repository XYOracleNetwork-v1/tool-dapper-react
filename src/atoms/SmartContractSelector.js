import React, { Component } from 'react'
import { Div } from 'glamorous'
import { withRouter } from 'react-router-dom'
import { SmartContracts, refreshContracts, web3 } from '../web3'
import Dropdown from 'react-dropdown'
import 'react-dropdown/style.css'
import './css/SmartContractSelector.css'

class SmartContractSelector extends Component {
  state = {
    contracts: undefined,
    selected: undefined,
  }
  componentDidMount() {
    refreshContracts(web3).then(() => {
      const contracts = SmartContracts.map(contract => {
        let contractOption = {
          value: contract.name,
          label: contract.name,
        }
        if (
          this.props.history.location.pathname &&
          this.props.history.location.pathname
            .slice(1)
            .startsWith(contract.name)
        ) {
          this.setState({ selected: contractOption })
        }
        return contractOption
      })
      this.setState({ contracts })
    })
  }
  _onSelect = contract => {
    if (!this.state.selected || this.state.selected.label !== contract.label) {
      this.setState({ selected: contract })
    }
    this.props.history.push(`/${contract.label}`)
  }

  render() {
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
          }}
          options={this.state.contracts}
          onChange={this._onSelect}
          value={this.state.selected}
          placeholder="Nothing Selected"
        />
      </Div>
    )
  }
}

export default withRouter(SmartContractSelector)
