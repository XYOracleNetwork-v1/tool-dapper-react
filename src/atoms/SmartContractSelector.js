import React, { Component } from 'react'
import { Div } from 'glamorous'
import { withRouter } from 'react-router-dom'
import Dropdown from 'react-dropdown'
import 'react-dropdown/style.css'
import './css/SmartContractSelector.css'

class SmartContractSelector extends Component {
  state = {
    selected: null,
  }

  _onSelect = selection => {
    if (!this.state.selected || this.state.selected.label !== selection.label) {
      this.setState({ selected: selection })
    }
    this.props.history.push(`/${selection.label}`)
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
      <Div css={{
        marginTop: 25,
      }}>
        <Dropdown
          css={{
            height: 60,
            fontFamily: `PT Sans`,
          }}
          options={options}
          onChange={this._onSelect}
          value={selected}
          placeholder='Nothing Selected'
        />
      </Div>
    )
  }
}

export default withRouter(SmartContractSelector)
