import React, { Component } from 'react'
import glam, { Div, Input } from 'glamorous'
import { DetailsHeader } from '../atoms/DetailsHeader'
import { DetailsButton } from '../atoms/DetailsButton'
import { withRouter } from 'react-router-dom'

const SettingsInput = glam.input({
  paddingLeft: 12,
  border: '1px solid #E0E0E0',
  borderRadius: '6px',
  backgroundColor: '#F6F6F6',
  width: 500,
  height: 40,
})
const RowLayout = glam.div({
  display: 'flex',
  flexDirection: 'row',
  paddingRight: 30,
  marginBottom: 40,
  marginLeft: 50,
})
const LeftColumn = glam.div({
  minWidth: 170,
  width: 170,
  marginTop: 10,
})
const CenterColumn = glam.div({
  lineHeight: 1,
  flex: 1,
  maxWidth: 500,
})

class Settings extends Component {
  state = {
    network: 'development',
    currentSource: 'local',
    local: '',
    ipfs: '',
    remote: '',
  }

  componentWillMount() {
    fetch('http://localhost:5000/settings')
      .then(result => {
        return result.json()
      })
      .then(result => {
        console.log(result.settings)
        this.setState(result.settings)
      })
  }

  handleChange = changeEvent => {
    let name = changeEvent.target.name
    let newState = this.state
    newState[name] = changeEvent.target.value
    this.setState(newState)
  }

  handleOptionChange = changeEvent => {
    this.setState({
      currentSource: changeEvent.target.value,
    })
  }
  handleNetworkChange = changeEvent => {
    this.setState({
      network: changeEvent.target.value,
    })
  }

  handleFormSubmit = formSubmitEvent => {
    formSubmitEvent.preventDefault()
    // TODO show activity indicator
    console.log('You have selected:', this.state.currentSource)

    fetch('http://localhost:5000/settings', {
      method: 'post',
      body: JSON.stringify({ settings: this.state }),
      headers: { 'Content-Type': 'application/json' },
    })
      .then(() => {
        return this.props.onSave()
      })
      .then(() => {
        this.props.history.push(`/`)
      })
      .catch(err => {
        this.props.onSave()
        this.props.history.push(`/`)
        console.log('Could not save', err)
      })
  }

  networkRadioInputs = options => {
    let inputs = []
    options.forEach(({ network, description }) => {
      inputs.push(
        <Div key={description}>
          <Input
            type="radio"
            value={network}
            checked={this.state.network === network}
            onChange={this.handleNetworkChange}
          />
          {description}
        </Div>,
      )
    })
    return inputs
  }

  leftColumnDiv = (source, description) => (
    <LeftColumn>
      <Input
        type="radio"
        value={source}
        checked={this.state.currentSource === { source }}
        onChange={this.handleOptionChange}
      />
      {description}
    </LeftColumn>
  )

  centerColumnDiv = (source, value, placeholder) => (
    <CenterColumn css={{ display: 'flex', flexDirection: 'row' }}>
      <SettingsInput
        type="text"
        value={value}
        name={source}
        placeholder={placeholder}
        onChange={this.handleChange}
      />
    </CenterColumn>
  )

  render() {
    return (
      <Div
        css={{
          color: '#4D4D5C',
          fontFamily: 'PT Sans',
          flex: 1,
          overflow: 'auto',
          marginRight: 60,
        }}
      >
        <DetailsHeader>Settings</DetailsHeader>

        <form onSubmit={this.handleFormSubmit}>
          <DetailsHeader css={{ fontSize: 19, marginLeft: 10 }}>
            Portis Network
          </DetailsHeader>
          <RowLayout css={{ justifyContent: 'space-between' }}>
            {this.networkRadioInputs([
              { network: 'development', description: 'Development (local)' },
              { network: 'kovan', description: 'Kovan' },
              { network: 'ropsten', description: 'Ropsten' },
              { network: 'mainnet', description: 'Main Net' },
            ])}
          </RowLayout>

          <DetailsHeader css={{ fontSize: 19, marginLeft: 10 }}>
            ABI Source
          </DetailsHeader>
          <RowLayout>
            {this.leftColumnDiv('local', 'Local Path')}
            {this.centerColumnDiv(
              'local',
              this.state.local,
              'ie. /path/to/abi/folder',
            )}
          </RowLayout>
          <RowLayout>
            {this.leftColumnDiv('ipfs', 'IPFS Address')}
            {this.centerColumnDiv(
              'ipfs',
              this.state.ipfs,
              'ie. QmRyaWmtHXByH1XzqNRmJ8uKLCqAbtem4bmfTdr7DmyxNJ',
            )}
          </RowLayout>
          <RowLayout>
            {this.leftColumnDiv('remote', 'AWS Bucket')}
            {this.centerColumnDiv(
              'remote',
              this.state.remote,
              'ie. layerone.smart-contracts/ABI',
            )}
          </RowLayout>

          <DetailsButton css={{ display: 'flex', marginTop: 50 }} type="submit">
            Save
          </DetailsButton>
        </form>
      </Div>
    )
  }
}

export default withRouter(Settings)
