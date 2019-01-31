import React, { Component } from 'react'
import Dropdown from 'react-dropdown'
import 'react-dropdown/style.css'

import './css/SmartContractSelector.css'

class SmartContractSelector extends Component {
  _onSelect = selection => {
    const { history, onSelect } = this.props
    history.push(`/simulator/${selection.label}`)
    onSelect(selection)
  }

  render() {
    const {
      contracts,
      match: {
        params: { contract: selectedContract },
      },
    } = this.props
    const options = contracts.map(({ name }) => ({ value: name, label: name }))

    console.log(`Selected`, options, this.props)
    return (
      <Dropdown
        css={{
          height: 60,
          fontFamily: `PT Sans`,
        }}
        options={options}
        onChange={this._onSelect}
        value={selectedContract}
        placeholder="Nothing Selected"
      />
    )
  }
}

export default SmartContractSelector
