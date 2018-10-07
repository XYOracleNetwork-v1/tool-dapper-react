import React, { Component } from 'react'
import glam, { Div } from 'glamorous'
import { BigNumber } from 'bignumber.js'
import TransactionResult from '../atoms/TransactionResult'
import TransactionError from '../atoms/TransactionError'
import { TransactionReceipt } from '../atoms/TransactionReceipt'
import { DetailsHeader } from '../atoms/DetailsHeader'
import { DetailsButton } from '../atoms/DetailsButton'

const MainDiv = glam.div({
  color: `#4D4D5C`,
  fontFamily: `PT Sans`,
  flex: 1,
  overflow: `auto`,
})
const FunctionPropertiesDiv = glam.div({
  display: `flex`,
  flexDirection: `column`,
  justifyContent: `flexStart`,
  lineHeight: `30px`,
  paddingLeft: `20px`,
  fontSize: `16px`,
  minWidth: 250,
})

const FunctionParamLayout = glam.div({
  display: `flex`,
  flexDirection: `row`,
  paddingBottom: `30px`,
  borderBottom: `1px solid #979797`,
  width: `100%`,
  flex: 1,
})
const FunctionParamList = glam.div({
  display: `flex`,
  flexDirection: `column`,
  justifyContent: `flex-start`,
  paddingLeft: 30,
  paddingRight: 30,
  flex: 1,
})

const InputBar = glam.input({
  marginTop: 8,
  marginRight: 8,
  paddingLeft: 8,
  border: `1px solid #E0E0E0`,
  borderRadius: `6px`,
  backgroundColor: `#F6F6F6`,
  height: 40,
  flex: 1,
})

const ParamInputDiv = glam.div({
  marginTop: 8,
  display: `flex`,
  flexDirection: `column`,
  minWidth: 300,
})

class FunctionDetails extends Component {
  state = {
    method: {
      inputs: [],
      outputs: [],
      name: `loading...`,
      type: ``,
    },
    service: this.props.service,
    transactionResult: undefined,
    transactionReceipt: undefined,
    transactionError: undefined,
    inputs: undefined,
    value: 0,
  }

  contract = {}

  componentDidMount() {
    this.updateInputs()
  }

  componentDidUpdate() {
    this.updateInputs()
  }

  updateInputs = () => {
    const { match } = this.props
    const { method } = this.state
    const { signature } = method

    const methodSig = match.params.method

    if (signature !== methodSig) {
      const contractName = match.params.contract
      this.contract = this.state.service.contractNamed(contractName)
      if (this.contract) {
        const { _jsonInterface } = this.contract
        const newMethod = this.methodObject(_jsonInterface, methodSig)
        if (newMethod) {
          this.setState({
            method: newMethod,
            transactionResult: undefined,
            transactionError: undefined,
            transactionReceipt: undefined,
            inputs: [],
            value: 0,
          })
        }
      }
    }
  }

  methodObject = (methods, sig) => {
    const methodObj = methods.find(method => method.signature === sig)
    if (methodObj) {
      return methodObj
    }
    return undefined
  }

  handleChange = e => {
    const { method } = this.state
    const inputs =
      this.state.inputs && this.state.inputs.length > 0
        ? this.state.inputs
        : method.inputs

    const newInputs = inputs.map(input => {
      if (input.name === e.target.name) {
        return { ...input, value: e.target.value }
      }
      return input
    })

    if (e.target.name === `Value`) {
      this.setState({ value: e.target.value })
    }
    this.setState({ inputs: newInputs })
  }

  handleExecute = async () => {
    const { method } = this.state

    this.setState({
      transactionResult: undefined,
      transactionError: undefined,
      transactionReceipt: undefined,
    })

    const methodName = method.name
    const { stateMutability } = method
    const inputParams = this.state.inputs.map(i => {
      if ([`uint256`, `uint128`, `uint64`].includes(i.type)) {
        if (!Number.isNaN(i.value)) {
          return new BigNumber(i.value)
        }
      }
      return i.value
    })

    try {
      const user = this.state.service.getCurrentUser()
      if (!user) {
        throw new Error(`No Current User, Refresh Page, or Login Metamask`)
      }
      console.log(`VALUE`, this.state.value)
      if (
        this.state.value === 0 &&
        (inputParams.length === 0 ||
          stateMutability === `view` ||
          stateMutability === `pure`)
      ) {
        // console.log(
        //   `Calling view or pure method \'${methodName}\' with params ${JSON.stringify(
        //     inputParams,
        //   )}`,
        // )
        const result = await this.contract.methods[methodName](
          ...inputParams,
        ).call()
        this.setState({ transactionResult: result })
      } else {
        // console.log(
        //   `Calling ${this.contract} ${methodName} with params ${JSON.stringify(
        //     inputParams,
        //   )}`,
        // )
        // For debugging purposes if you need to examine the call to web3 provider:
        // this.contract.methods
        //   .mint(...inputParams)
        //   .send({ from: user, value: this.state.value })
        this.contract.methods[methodName](...inputParams)
          .send({ from: user, value: this.state.value })
          .then(transactionReceipt => {
            console.log(`Got receipts`, transactionReceipt)
            this.setState({ transactionReceipt })
          })
          .catch(e => this.setState({ transactionError: e }))
      }
    } catch (e) {
      this.setState({ transactionError: e })
    }
  }

  getInputValue = name => {
    let val = ``
    const input = this.state.inputs.filter(input => input.name === name)
    if (input) {
      val = input[0] ? (input[0].value ? input[0].value : ``) : ``
    }
    return val
  }

  getInputs = method => {
    const results = method.inputs.map(input => (
      <ParamInputDiv key={input.name}>
        {input.name}
        <InputBar
          type="text"
          name={input.name}
          placeholder={input.type}
          onChange={this.handleChange}
          value={this.getInputValue(input.name)}
        />
      </ParamInputDiv>
    ))
    if (method.stateMutability === `payable`) {
      results.push(
        <ParamInputDiv key="Value">
          Value To Transfer
          {` `}
          <InputBar
            type="text"
            name="Value"
            placeholder="ETH (wei)"
            onChange={this.handleChange}
            value={this.state.value}
          />
        </ParamInputDiv>,
      )
    }
    return results
  }

  render() {
    const {
      method,
      transactionResult,
      transactionReceipt,
      transactionError,
    } = this.state

    return (
      <MainDiv>
        <DetailsHeader>
          {method.name}
          ()
        </DetailsHeader>
        <FunctionParamLayout>
          <FunctionPropertiesDiv>
            {method.name}(
            {method.inputs
              .map(input => `${input.type} ${input.name}`)
              .join(`, `)}
            )<Div>{method.stateMutability}</Div>
            {method.outputs.map(
              output => `returns (${output.type} ${output.name})`,
            )}
          </FunctionPropertiesDiv>
          <FunctionParamList>{this.getInputs(method)}</FunctionParamList>

          <DetailsButton onClick={this.handleExecute}>EXECUTE</DetailsButton>
        </FunctionParamLayout>

        <TransactionResult result={transactionResult} />
        <TransactionError error={transactionError} />
        <TransactionReceipt {...transactionReceipt} />
      </MainDiv>
    )
  }
}
export default FunctionDetails
