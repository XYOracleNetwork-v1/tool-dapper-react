import React, { Component } from 'react'
import { Div } from 'glamorous'
import { withRouter } from 'react-router-dom'
import Dropdown from 'react-dropdown'
import 'react-dropdown/style.css'
import './css/SmartContractSelector.css'

class SmartContractSelector extends Component {
  state = {
    selected: undefined,
  }

  defaultProps = {
    selected: `Nothing Selected`,
  }

  _onSelect = selection => {
    if (!this.state.selected || this.state.selected.label !== selection.label) {
      this.setState({ selected: selection })
    }
    this.props.history.push(`/${selection.label}`)
    this.props.onSelect(selection)
  }

  render() {
    console.log(`SDF`, this.props.history.location.pathname.split(`/`))
    let selected = undefined
    let options = this.props.contracts.map(contract => {
      let contractOption = {
        value: contract.name,
        label: contract.name,
      }
      if (
        this.props.history.location.pathname &&
        this.props.history.location.pathname
          .split(`/`)[1]
          .startsWith(contract.name)
      ) {
        selected = this.props.history.location.pathname.split(`/`)[1]
      }

      return contractOption
    })

    console.log(`Selected`, options, selected, this.props)
    return (
      <Dropdown
        css={{
          height: 60,
          fontFamily: `PT Sans`,
        }}
        options={options}
        onChange={this._onSelect}
        value={selected}
        placeholder="Nothing Selected"
      />
    )
  }
}

export default withRouter(SmartContractSelector)
