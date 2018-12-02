import React, { Component } from "react"
import { Div } from "glamorous"
import TransactionResult from "../atoms/TransactionResult"
import TransactionError from "../atoms/TransactionError"
import { TransactionReceipt } from "../atoms/TransactionReceipt"
import { DetailsHeader } from "../atoms/DetailsHeader"
import ProgressButton, { STATE } from "react-progress-button"
import {
  MainDiv,
  FunctionParamLayout,
  FunctionPropertiesDiv,
  FunctionParamList,
  InputBar,
  ParamInputDiv,
  Horizontal, 
  FormattedProgressButton
} from "../molecules/FunctionDetailsComponents"
import { getMethodSig } from "../molecules/FunctionsList"

class FunctionDetails extends Component {
  state = {
    method: {
      inputs: [],
      outputs: [],
      name: `loading...`,
      type: ``,
      executeBtnState: STATE.LOADING,
    },
    service: this.props.service,
    transactionResult: undefined,
    transactionReceipt: undefined,
    transactionError: undefined,
    inputs: undefined,
    contractAbi: undefined,
  }

  componentDidMount() {
    this.updateInputs()
  }

  componentDidUpdate() {
    this.updateInputs()
  }

  updateInputs = () => {
    const { match } = this.props
    const signature = getMethodSig(this.state.method)
    const methodSig = match.params.method
    if (signature !== methodSig) {
      const contractName = match.params.contract
      let contract = this.state.service.contractObject(contractName)
      if (contract) {
        const { abi } = contract
        const newMethod = this.methodObject(abi, methodSig)
        if (newMethod) {
          this.setState({
            method: newMethod,
            transactionResult: undefined,
            transactionError: undefined,
            transactionReceipt: undefined,
            inputs: [],
            value: 0,
            executeBtnState: STATE.NOTHING,
            contractAbi: abi,
          })
        }
      }
    }
  }

  methodObject = (methods, sig) => {
    const methodObj = methods.find(method => getMethodSig(method) === sig)
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

  executeContract = async (user, contract) => {
    const { method } = this.state

    const inputParams = this.state.inputs.map(i => i.value)
    const methodName = method.name
    const { stateMutability } = method
    if (
      this.state.value === 0 &&
      (inputParams.length === 0 ||
        stateMutability === `view` ||
        stateMutability === `pure`)
    ) {
      console.log(
        `Calling view or pure method \'${methodName}\' with params ${JSON.stringify(
          inputParams,
        )}`,
      )
      const result = await contract.methods[methodName](...inputParams).call()
      this.setState({
        transactionResult: result,
        executeBtnState: STATE.SUCCESS,
      })
    } else {
      console.log(
        `Calling ${contract} ${methodName} with params ${JSON.stringify(
          inputParams,
        )}`,
      )
      // For debugging purposes if you need to examine the call to web3 provider:
      // contract.methods
      //   .mint(...inputParams)
      //   .send({ from: user, value: this.state.value })
      await contract.methods[methodName](...inputParams)
        .send({ from: user, value: this.state.value })
        .then(transactionReceipt => {
          console.log(`Got receipts`, transactionReceipt)
          this.setState({
            transactionReceipt,
            executeBtnState: STATE.SUCCESS,
          })
        })
        .catch(e =>
          this.setState({
            transactionError: e,
            executeBtnState: STATE.ERROR,
          }),
        )
    }
  }

  handleExecute = async e => {
    e.preventDefault()
    this.setState({
      transactionResult: undefined,
      transactionError: undefined,
      transactionReceipt: undefined,
      executeBtnState: STATE.LOADING,
    })

    try {
      const user = this.state.service.getCurrentUser()
      if (!user) {
        throw new Error(`No Current User, Refresh Page, or Login Metamask`)
      }

      const { selectedAddress } = this.props
      if (!selectedAddress) {
        throw new Error(
          `No contract address selected, contract must be deployed at address.`,
        )
      }
      console.log(`SNUCK PAST SELECTED ADDRESS`, selectedAddress, this.props)
      let contract = this.state.service.createContract(
        this.state.contractAbi,
        selectedAddress,
      )
      await this.executeContract(user, contract)
    } catch (e) {
      this.setState({
        transactionError: e,
        executeBtnState: STATE.ERROR,
      })
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
    const results = method.inputs.map((input, index) => {
      if (input.name === ``) {
        input.name = `param${index}`
      }
      return (
        <ParamInputDiv key={input.name}>
          {input.name}
          <InputBar
            type='text'
            name={input.name}
            placeholder={input.type}
            onChange={this.handleChange}
            value={this.getInputValue(input.name)}
          />
        </ParamInputDiv>
      )
    })

    if (method.stateMutability === `payable`) {
      results.push(
        <ParamInputDiv key='Value'>
          Value To Transfer
          <InputBar
            type='text'
            name='Value'
            placeholder='ETH (wei)'
            onChange={this.handleChange}
            value={this.state.value}
          />
        </ParamInputDiv>,
      )
    }
    return results
  }

  functionProperties = method => (
    <Div>
      {method.name}(
      {method.inputs.map(input => `${input.type} ${input.name}`).join(`, `)})
      <Div>{method.stateMutability}</Div>
      {method.outputs.length === 0
        ? ``
        : `returns (` +
          method.outputs
            .map(
              output => `${output.type}${output.name ? ` ` : ``}${output.name}`,
            )
            .join(`, `) +
          `)`}
    </Div>
  )

  render() {
    const {
      method,
      transactionResult,
      transactionReceipt,
      transactionError,
    } = this.state

    return (
      <MainDiv>
        <DetailsHeader>{method.name}()</DetailsHeader>
        <FunctionParamLayout>
          <Horizontal>
            <FunctionPropertiesDiv>
              {this.functionProperties(method)}
            </FunctionPropertiesDiv>
            <FunctionParamList>{this.getInputs(method)}</FunctionParamList>
          </Horizontal>

          <FormattedProgressButton
            state={this.state.executeBtnState}
            onClick={this.handleExecute}
          >
            Execute
          </FormattedProgressButton>
        </FunctionParamLayout>

        <TransactionResult result={transactionResult} />
        <TransactionError error={transactionError} />
        <TransactionReceipt {...transactionReceipt} />
      </MainDiv>
    )
  }
}
export default FunctionDetails
