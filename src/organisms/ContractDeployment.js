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
} from "../molecules/FunctionDetailsComponents"

class ContractDeployment extends Component {
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
  }

  componentDidMount() {
    this.updateInputs()
  }

  componentWillUpdate() {
    this.updateInputs()
  }

  updateInputs = () => {
    
    const { match } = this.props
    const contractName = match.params.contract
    this.contract = this.state.service.contractObject(contractName)
    if (this.contract && this.state.method.executeBtnState == STATE.LOADING) {
      const { abi } = this.contract

      const newMethod = this.methodObject(abi)
      if (newMethod) {
        this.setState({
          method: newMethod,
          transactionResult: undefined,
          transactionError: undefined,
          transactionReceipt: undefined,
          inputs: [],
          value: 0,
          executeBtnState: STATE.NOTHING,
        })
      }
    }
  }

  methodObject = methods => {
    const methodObj = methods.find(method => method.type === `constructor`)
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

  handleExecute = async (e) => {
    e.preventDefault();

    const { match } = this.props
    const contractName = match.params.contract
    this.setState({
      transactionResult: undefined,
      transactionError: undefined,
      transactionReceipt: undefined,
      executeBtnState: STATE.LOADING,
    })

    const inputParams = this.state.inputs.map(i => i.value)
    const user = this.state.service.getCurrentUser()
    if (!user) {
      this.setState({
        executeBtnState: STATE.ERROR,
        transactionError: new Error(
          `No Current User, Refresh Page, or Login Metamask`,
        ),
      })
      return
    }
    await this.contract.contract
      .deploy({
        data: this.contract.bytecode,
        arguments: inputParams,
      })
      .send(
        {
          value: this.state.value,
          from: user,
        },
        function(error, transactionHash) {
          console.log(`Finished Deploy Call`, error, transactionHash)
        },
      )
      .then(newContractInstance => {
        this.setState({
          executeBtnState: STATE.SUCCESS,
          transactionResult: newContractInstance
        })
        let contractObj = this.props.service.addDeployedContract(
          this.contract.ipfs,
          contractName,
          newContractInstance,
          this.contract.bytecode,
        )
        console.log(`Received New Instance`, newContractInstance, contractObj)
      })
      .catch(error => {
        console.log(`error`, error)
        this.setState({
          executeBtnState: STATE.ERROR,
          transactionError: error,
        })
      })
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
      {method.type}(
      {method.inputs.map(input => `${input.type} ${input.name}`).join(`, `)})
      <Div>{method.stateMutability}</Div>
    </Div>
  )

  render() {
    const { method, transactionResult, transactionReceipt } = this.state
    console.log(`Render Contract Deployment`, this.state)
    return (
      <MainDiv>
        <DetailsHeader>{this.props.match.params.contract}</DetailsHeader>
        <FunctionParamLayout>
          <FunctionPropertiesDiv>
            {this.functionProperties(method)}
          </FunctionPropertiesDiv>
          <FunctionParamList>{this.getInputs(method)}</FunctionParamList>
          <ProgressButton
            style={{ width: 300 }}
            state={this.state.executeBtnState}
            onClick={this.handleExecute}
          >
            DEPLOY CONTRACT
          </ProgressButton>
        </FunctionParamLayout>

        <TransactionResult result={transactionResult} />
        <TransactionError error={this.state.transactionError} />
        <TransactionReceipt {...transactionReceipt} />
      </MainDiv>
    )
  }
}
export default ContractDeployment
