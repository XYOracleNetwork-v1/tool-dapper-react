import React, { Component } from "react"
import glam, { Div, Input } from "glamorous"
import { withRouter } from "react-router-dom"
import { withCookies } from "react-cookie"
import { DetailsHeader } from "../atoms/DetailsHeader"
import { DetailsButton } from "../atoms/DetailsButton"
import fetchABI from "../organisms/ABIReader"
import FolderDropzone from "../organisms/FolderDropzone"
import { readSettings } from "../atoms/CookieReader"

const networkDescriptions = [
  { network: `development`, description: `Development (local)` },
  { network: `kovan`, description: `Kovan` },
  { network: `ropsten`, description: `Ropsten` },
  { network: `rinkeby`, description: `Rinkeby` },
  { network: `mainnet`, description: `Main Net` },
]
const SettingsInput = glam.input({
  paddingLeft: 12,
  border: `1px solid #E0E0E0`,
  borderRadius: `6px`,
  backgroundColor: `#F6F6F6`,
  width: 500,
  height: 40,
})
const RadioInput = props => <Input type={`radio`} {...props} />

const RowLayout = glam.div({
  display: `flex`,
  flexDirection: `row`,
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
const SettingsLayout = glam.div({
  color: `#4D4D5C`,
  fontFamily: `PT Sans`,
  flex: 1,
  overflow: `auto`,
  marginRight: 60,
})
class Settings extends Component {
  constructor(props) {
    super(props)

    this.state = readSettings(props.cookies)
  }

  handleChange = changeEvent => {
    this.stateChange(changeEvent.target.name, changeEvent.target.value)
  }

  stateChange = (stateKey, stateValue) => {
    console.log(`attempting State Change`, stateKey, stateValue)
    this.props.cookies.set(stateKey, stateValue, {
      path: `/`,
    })
    const newState = this.state
    newState[stateKey] = stateValue

    this.setState(newState)
  }

  handleSourceSelect = changeEvent =>
    this.stateChange(`currentSource`, changeEvent.target.name)

  handleOptionChange = changeEvent =>
    this.stateChange(`currentSource`, changeEvent.target.value)

  handleNetworkChange = changeEvent =>
    this.stateChange(`portisNetwork`, changeEvent.target.value)

  handleFormSubmit = formSubmitEvent => {
    formSubmitEvent.preventDefault()
    // TODO show activity indicator
    console.log(`You have selected:`, this.state.currentSource)

    this.props
      .onSave()
      .then(() => {
        this.props.history.push(`/`)
      })
      .catch(err => {
        this.props.history.push(`/`)
        console.log(`Could not save`, err)
      })
  }

  refreshABI = async () => {
    if (!this.props.cookies) {
      return true
    }
    console.log(`REFRESHING ABI`, this.props.cookies)
    return fetchABI(this.props.cookies).then(() => {
      return this.props.onSave()
    })
  }

  networkRadioInputs = () => {
    const inputs = []
    networkDescriptions.forEach(({ network, description }) => {
      inputs.push(
        <Div key={description}>
          <RadioInput
            value={network}
            checked={this.state.portisNetwork === network}
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
      <RadioInput
        value={source}
        checked={this.state.currentSource === source}
        onChange={this.handleOptionChange}
      />
      {description}
    </LeftColumn>
  )

  centerColumnDiv = (source, value, placeholder) => (
    <CenterColumn css={{ display: `flex`, flexDirection: `row` }}>
      <SettingsInput
        type='text'
        value={value}
        name={source}
        placeholder={placeholder}
        onChange={this.handleChange}
        onSelect={this.handleSourceSelect}
      />
    </CenterColumn>
  )

  render() {
    return (
      <SettingsLayout>
        <DetailsHeader>Settings</DetailsHeader>
        <DetailsHeader css={{ fontSize: 19, marginLeft: 10 }}>
          Portis Network
        </DetailsHeader>
        <RowLayout css={{ justifyContent: `space-between` }}>
          {this.networkRadioInputs()}
        </RowLayout>
        <DetailsHeader css={{ fontSize: 19, marginLeft: 10 }}>
          ABI Source
        </DetailsHeader>
        <Div
          style={{
            margin: 40,
            display: `flex`,
            justifyContent: `center`,
            align: `center`,
            textAlign: `center`,
          }}
        >
          <FolderDropzone
            onSave={async ipfsHash => {
              this.stateChange(`ipfs`, ipfsHash)
              await this.refreshABI()
            }}
          />
        </Div>
        <RowLayout>
          {this.leftColumnDiv(`ipfs`, `IPFS Address`)}
          {this.centerColumnDiv(
            `ipfs`,
            this.state.ipfs,
            `ie. QmRyaWmtHXByH1XzqNRmJ8uKLCqAbtem4bmfTdr7DmyxNJ`,
          )}
          <DetailsButton
            onClick={this.handleFormSubmit}
          >
            Update IPFS
          </DetailsButton>
        </RowLayout>
        
      </SettingsLayout>
    )
  }
}

export default withCookies(withRouter(Settings))
