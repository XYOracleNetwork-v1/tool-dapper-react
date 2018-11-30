import React, { Component } from "react"
import glam, { Div, Img } from "glamorous"
import { Route, Link, Switch } from "react-router-dom"
import SmartContractService from "./SmartContractService"
import SmartContractSelector from "../atoms/SmartContractSelector"
import ContractAddressDropdown from "../atoms/ContractAddressDropdown"
import { FunctionsList } from "../molecules/FunctionsList"
import FunctionDetails from "./FunctionDetails"
import Settings from "./Settings"
import cog from "../assets/cog.svg"
import { withCookies } from "react-cookie"
import PageHeader from "../molecules/PageHeader"
import ContractDeployment from "./ContractDeployment"

const Sidebar = glam.div({
  display: `flex`,
  flexDirection: `column`,
  width: 413,
  minWidth: 413,
  height: `100%`,
  borderRight: `1px solid #979797`,
  backgroundColor: `#F8F8F8`,
})

const SelectContractLayout = glam.div({
  display: `flex`,
  height: 220,
  flexDirection: `column`,
  backgroundColor: `#5B5C6D`,
  fontFamily: `PT Sans`,
  padding: 30,
})

const SelectContractHeader = glam.div({
  color: `white`,
  fontSize: 23,
})

const SpaceBetweenRow = glam.div({
  display: `flex`,
  flexDirection: `row`,
  justifyContent: `space-between`,
})

const MainLayoutDiv = glam.div({
  display: `flex`,
  flexDirection: `row`,
  justifyContent: `flex-start`,
  flex: 1,
  height: `100%`,
})

class HomeComponent extends Component {
  state = {
    validNetwork: true,
    service: new SmartContractService(this.props),
    serviceError: undefined,
    currentUser: undefined,
    selectedAddress: undefined,
  }

  componentWillMount() {
    this.reloadWeb3().then(() => {
      // Will refresh local store when new user is chosen:
      if (this.state.service.getCurrentConfigStore()) {
        this.state.service.getCurrentConfigStore().on(`update`, this.reloadUser)
      }
    })
  }

  reloadUser = () => {
    return this.state.service.refreshUser().then(user => {
      this.setState({ currentUser: user })
    })
  }

  reloadWeb3 = async (shouldThrow = false) => {
    return this.state.service
      .reloadWeb3(this.props.cookies)
      .then(() => this.state.service.validateContracts())
      .then(validNetwork => {
        this.setState({
          validNetwork: validNetwork,
        })
      })
      .catch(err => {
        this.setState({ validNetwork: false })
        if (err) {
          this.setState({ serviceError: err })
        }
        if (shouldThrow) {
          console.log(`Caught error while injecting`, err)

          throw err
        }
      })
  }

  // validateNetwork

  render() {
    return (
      <Div css={{ height: `100%`, width: `100%` }}>
        <PageHeader service={this.state.service} />
        <MainLayoutDiv>
          <Sidebar>
            <SelectContractLayout>
              <SpaceBetweenRow>
                <SelectContractHeader>Select Contract</SelectContractHeader>
                <Link to={`/settings`}>
                  <Img src={cog} />
                </Link>
              </SpaceBetweenRow>
              <SmartContractSelector
                contracts={this.state.service.getSmartContracts()}
              />
              <ContractAddressDropdown
                onChange={selection => {
                  console.log(`Address Selected`, selection)
                  this.setState({
                    selectedAddress: selection,
                  })
                }}
                service={this.state.service}
              />
            </SelectContractLayout>
            <Route
              path='/:contract'
              render={props => (
                <FunctionsList {...props} service={this.state.service} />
              )}
            />
          </Sidebar>
          <Div
            css={{
              display: `flex`,
              flexDirection: `column`,
            }}
          >
            <Route
              path='/settings'
              render={props => (
                <Settings
                  {...props}
                  service={this.state.service}
                  onSave={this.reloadWeb3}
                />
              )}
            />
            <Switch>
              <Route
                exact
                path='/:contract/deploy'
                render={props => (
                  <ContractDeployment {...props} service={this.state.service} />
                )}
                service={this.state.service}
              />
              <Route
                exact
                path='/:contract/:method'
                render={props => (
                  <FunctionDetails {...props} service={this.state.service} selectedAddress={this.state.selectedAddress} />
                )}
                service={this.state.service}
              />
            </Switch>
          </Div>
        </MainLayoutDiv>
      </Div>
    )
  }
}
export default withCookies(HomeComponent)
