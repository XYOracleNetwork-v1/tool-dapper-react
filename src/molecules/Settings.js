import React, { Component } from 'react'
import glam, { Div, Img, Button, Input } from 'glamorous'
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

  render() {
    return (
      <Div
        css={{
          color: '#4D4D5C',
          fontFamily: 'PT Sans',
          flex: 1,
          overflow: 'auto',
        }}
      >
        <DetailsHeader>Settings</DetailsHeader>
        <DetailsHeader css={{ fontSize: 19, marginLeft: 10 }}>
          ABI Source
        </DetailsHeader>
        <form onSubmit={this.handleFormSubmit}>
          <RowLayout>
            <LeftColumn>
              <Input
                type="radio"
                value="local"
                checked={this.state.currentSource === 'local'}
                onChange={this.handleOptionChange}
              />
              Local Path
            </LeftColumn>
            <CenterColumn css={{ display: 'flex', flexDirection: 'row' }}>
              <SettingsInput
                type="text"
                value={this.state.local}
                name="local"
                placeholder="ie. /path/to/abi/folder"
                onChange={this.handleChange}
              />
            </CenterColumn>
          </RowLayout>
          <RowLayout>
            <LeftColumn>
              <Input
                type="radio"
                value="ipfs"
                checked={this.state.currentSource === 'ipfs'}
                onChange={this.handleOptionChange}
              />
              IPFS Address
            </LeftColumn>
            <CenterColumn css={{ display: 'flex', flexDirection: 'row' }}>
              <SettingsInput
                type="text"
                value={this.state.ipfs}
                name="ipfs"
                placeholder="ie. QmRyaWmtHXByH1XzqNRmJ8uKLCqAbtem4bmfTdr7DmyxNJ"
                onChange={this.handleChange}
              />
            </CenterColumn>
          </RowLayout>
          <RowLayout>
            <LeftColumn>
              <Input
                type="radio"
                value="remote"
                checked={this.state.currentSource === 'remote'}
                onChange={this.handleOptionChange}
              />
              AWS Bucket
            </LeftColumn>
            <CenterColumn css={{ display: 'flex', flexDirection: 'row' }}>
              <SettingsInput
                type="text"
                value={this.state.remote}
                name="remote"
                placeholder="ie. layerone.smart-contracts/ABI"
                onChange={this.handleChange}
              />
            </CenterColumn>
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
