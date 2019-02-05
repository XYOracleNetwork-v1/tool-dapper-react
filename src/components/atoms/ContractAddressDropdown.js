import React, { Component } from 'react'
import glam, { Div } from 'glamorous'
import { withRouter } from 'react-router-dom'
import { withCookies } from 'react-cookie'

import Dropdown from './Dropdown'

const GreyTopped = glam.div({
  paddingTop: 10,
  color: `#c8c8c8`,
})

class ContractAddressDropdown extends Component {
  constructor(props) {
    super(props)
    this.state = { contractObjects: this.fetchObjects() }
  }

  fetchObjects = () => {
    const {
      match: {
        params: { contract },
      },
      getDeployedContractObjects,
    } = this.props
    return getDeployedContractObjects(contract) || []
  }

  _onSelect = ({ value }) => {
    const { onSelect } = this.props
    const { contractObjects } = this.state
    const objToSelect = contractObjects.find(
      ({ address, notes }) => value === address || value === notes,
    )
    const { notes, address } = objToSelect
    console.log({ objToSelect })

    onSelect({ notes, address })
  }

  getOptionValue = val => (val.length > 20 ? `${val.substring(0, 20)}...` : val)

  render() {
    const { selectedNotes, selectedAddress, network } = this.props
    const { contractObjects } = this.state
    return (
      <Div
        css={{
          marginTop: 25,
        }}
      >
        {!contractObjects || contractObjects.length === 0 ? (
          <GreyTopped>Not deployed on {network.name}</GreyTopped>
        ) : (
          <Dropdown
            options={contractObjects.map(({ notes, address }) => {
              const value = notes || address
              const label = this.getOptionValue(value)
              return {
                value,
                label,
              }
            })}
            onChange={this._onSelect}
            value={selectedNotes || selectedAddress}
            placeholder="Nothing Selected"
          />
        )}
      </Div>
    )
  }
}

export default withCookies(withRouter(ContractAddressDropdown))
