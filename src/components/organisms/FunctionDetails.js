import React, { Component } from 'react'
import { Form } from 'glamorous'
import { TransactionReceipt } from '../atoms/TransactionReceipt'
import { STATE } from 'react-progress-button'
import {
  FunctionParamList,
  ParamInputDiv,
  ExecuteFunctionButton,
} from '../molecules/FunctionDetailsComponents'
import { getMethodSig } from '../molecules/FunctionsList'
import TextInput from '../atoms/TextInput'
import ResultDiv from '../atoms/ResultDiv'
import { stringify } from '../../util/JSON'
import asyncSetState from '../../util/asyncSetState'

class FunctionDetails extends Component {
  constructor(props) {
    super(props)
    this.state = {
      executeBtnState: STATE.NOTHING,
    }
    this.updateInputs()
  }

  componentDidUpdate(prevProps) {
    const {
      match: {
        params: { method: prevMethodSig },
      },
      network: prevNetwork,
    } = prevProps
    const {
      match: {
        params: { method: methodSig },
      },
      network,
    } = this.props

    if (prevMethodSig !== methodSig || prevNetwork !== network) {
      this.updateInputs()
    }
  }

  updateInputs = () => {
    const {
      match: {
        params: { contract: contractName, method: methodSig },
      },
      getContractObject,
    } = this.props

    const { abi } = getContractObject(contractName)
    if (abi) {
      const method = this.methodObject(abi, methodSig)
      if (method) {
        const inputs = method.inputs.reduce(
          (acc, input) => ({ [input.name]: '' }),
          {},
        )
        this.setState({
          method,
          inputs,
          value: 0,
          executeBtnState: STATE.NOTHING,
          contractAbi: abi,
        })
      }
    }
  }

  methodObject = (methods, sig) =>
    methods.find(method => getMethodSig(method) === sig)

  handleChange = e => {
    const { inputs } = this.state
    const { name: inputName, value } = e.target
    if (inputName === 'Value') {
      return this.setState({ value })
    }

    const newInputs = inputs
    newInputs[inputName] = value

    this.setState({ inputs: newInputs })
  }

  executeContract = async (user, contract) => {
    const {
      method: { stateMutability, name: methodName },
      inputs,
      value,
    } = this.state
    const inputParams = Object.entries(inputs).map(([name, value]) => value)
    if (
      value === 0 &&
      (inputParams.length === 0 ||
        stateMutability === `view` ||
        stateMutability === `pure`)
    ) {
      // console.log(
      //   `Calling view or pure method \'${methodName}\' with params ${JSON.stringify(
      //     inputParams,
      //   )}`,
      // )
      const result = await contract.methods[methodName](...inputParams).call()
      this.setState({
        transactionResult: result,
        executeBtnState: STATE.SUCCESS,
      })
    } else {
      // console.log(
      //   `Calling ${contract} ${methodName} with params ${JSON.stringify(
      //     inputParams,
      //   )}`,
      // )
      // For debugging purposes if you need to examine the call to web3 provider:
      // contract.methods
      //   .mint(...inputParams)
      //   .send({ from: user, value: this.state.value })
      const transactionReceipt = await contract.methods[methodName](
        ...inputParams,
      )
        .send({ from: user, value: this.state.value, gas: 4712388 })
        .catch(e =>
          this.setState({
            transactionError: e,
            executeBtnState: STATE.ERROR,
          }),
        )
      console.log(`Got receipts`, transactionReceipt)
      this.setState({
        transactionReceipt,
        executeBtnState: STATE.SUCCESS,
      })
    }
  }

  handleExecute = async e => {
    e.preventDefault()
    const { user, createContract, selectedAddress } = this.props
    const { contractAbi } = this.state
    await asyncSetState(this.setState.bind(this), {
      transactionResult: null,
      transactionError: null,
      transactionReceipt: null,
      executeBtnState: STATE.LOADING,
    })

    try {
      if (!user) {
        throw new Error(`Please connect a wallet`)
      }

      if (!selectedAddress) {
        throw new Error(
          `No contract address selected, contract must be deployed at address.`,
        )
      }

      const contract = createContract(contractAbi, selectedAddress)
      await this.executeContract(user, contract)
    } catch (e) {
      this.setState({
        transactionError: e,
        executeBtnState: STATE.ERROR,
      })
      throw e
    }
  }

  getInputs = () => {
    const { method, inputs } = this.state
    if (!method || !inputs) return null
    return method.inputs.map(({ name, type }, index) => (
      <ParamInputDiv key={name}>
        <TextInput
          label={name}
          name={name || `param-${index}`}
          id={name}
          placeholder={type}
          onChange={this.handleChange}
          value={inputs[name]}
        />
      </ParamInputDiv>
    ))
  }

  render() {
    const { network } = this.props
    const {
      method,
      transactionResult,
      transactionReceipt,
      transactionError,
      executeBtnState,
      value,
    } = this.state

    if (!network) return <div>Please connect a wallet</div>
    if (!method) return <div>Loading...</div>

    return (
      <>
        <h2>{method.name}</h2>
        <Form
          css={{
            display: `flex`,
            flexDirection: `column`,
            paddingBottom: 40,
            borderBottom: `1px solid #979797`,
            width: `100%`,
          }}
          onSubmit={this.handleExecute}
        >
          <FunctionParamList>
            {this.getInputs()}
            {method.stateMutability === 'payable' && (
              <ParamInputDiv key="Value">
                Value To Transfer
                <TextInput
                  name="Value"
                  id="value"
                  placeholder="ETH (wei)"
                  onChange={this.handleChange}
                  value={value}
                />
              </ParamInputDiv>
            )}
          </FunctionParamList>
          <ExecuteFunctionButton state={executeBtnState} type="submit">
            Execute
          </ExecuteFunctionButton>
        </Form>
        {transactionResult && (
          <ResultDiv title="Result">{stringify(transactionResult)}</ResultDiv>
        )}
        {transactionError && (
          <ResultDiv title="Error">{transactionError.toString()}</ResultDiv>
        )}
        {transactionReceipt && (
          <TransactionReceipt transactionReceipt={transactionReceipt} />
        )}
      </>
    )
  }
}

export default FunctionDetails
