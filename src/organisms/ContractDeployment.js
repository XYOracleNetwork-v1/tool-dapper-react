import React, { Component } from "react"
import { Div } from "glamorous"
import TransactionResult from "../atoms/TransactionResult"
import TransactionError from "../atoms/TransactionError"
import { TransactionReceipt } from "../atoms/TransactionReceipt"
import { DetailsHeader } from "../atoms/DetailsHeader"
import { STATE } from "react-progress-button"
import {
  MainDiv,
  FunctionParamLayout,
  FunctionPropertiesDiv,
  FunctionParamList,
  InputBar,
  ParamInputDiv,
  Horizontal,
  FormattedProgressButton,
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
    notes: ``,
    libraries: {},
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
    let contract = this.state.service.contractObject(contractName)
    if (contract && this.state.method.executeBtnState == STATE.LOADING) {
      const { abi, notes } = contract

      const newMethod = this.methodObject(abi)
      if (newMethod) {
        this.setState({
          method: newMethod,
          transactionResult: undefined,
          transactionError: undefined,
          transactionReceipt: undefined,
          inputs: [],
          value: 0,
          notes: notes,
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

  handleLibChange = e => {
    let libs = this.state.libraries
    libs[e.target.name] = e.target.value
    console.log(`SETTING LIBRARY STATE`, this.state)
    this.setState({ libraries: libs })
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

    if (e.target.name === `Notes`) {
      this.setState({ notes: e.target.value })
    }
    this.setState({ inputs: newInputs })
  }

  findLibraryNames = bytecode => {
    let regex = /__([A-Za-z0-9]+)[_]+/g
    let match = bytecode.match(regex)
    if (match && match.length > 0) {
      console.log(`Found Library!`, match)
      return match.map(m => m.replace(/_/g, ``))
    }
    return []
  }

  linkLibrary = (bytecode, libName, libAddress) => {
    let symbol = `__` + libName + `_`.repeat(40 - libName.length - 2)
    return bytecode.split(symbol).join(libAddress.toLowerCase().substr(2))
  }

  deployContract = async user => {
    const inputParams = this.state.inputs
      ? this.state.inputs.map(i => i.value)
      : []
    let contractObj = this.state.service.contractObject(
      this.props.match.params.contract,
    )
    let bytecode = contractObj.bytecode
    let contract = this.state.service.createContract(contractObj.abi)

    let libraries = Object.entries(this.state.libraries)
    if (libraries.length > 0) {
      libraries.forEach(lib => {
        bytecode = this.linkLibrary(bytecode, lib[0], lib[1])
      })
    }

    contract
      .deploy({
        data: bytecode,
        arguments: inputParams,
      })
      .send(
        {
          value: this.state.value,
          from: user,
          gas: 4712388,
        },
        function(error, transactionHash) {
          console.log(`Finished Deploy Call`, error, transactionHash)
        },
      )
      .then(newContractInstance => {
        this.setState({
          executeBtnState: STATE.SUCCESS,
          transactionResult: {
            "Deployed To Address": newContractInstance._address,
            IPFS: contractObj.ipfs,
            Name: contractObj.name,
          },
        })
        this.props.service.addDeployedContract(
          contractObj.ipfs,
          contractObj.name,
          newContractInstance._address,
          bytecode,
          contractObj.abi,
          this.state.notes,
        )
        this.props.onDeploy({
          notes: this.state.notes,
          address: newContractInstance._address,
        })
        console.log(
          `Created New Instance`,
          contractObj.ipfs,
          contractObj.name,
          newContractInstance._address,
          bytecode,
          contractObj.abi,
          this.state.notes,
        )
      })
      .catch(error => {
        console.log(`error`, error)
        this.setState({
          executeBtnState: STATE.ERROR,
          transactionError: error,
        })
      })
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
        throw new Error(`Please connect a wallet`)
      }

      await this.deployContract(user)
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
    let contractObj = this.state.service.contractObject(
      this.props.match.params.contract,
    )
    const results = []

    if (contractObj) {
      let libraries = this.findLibraryNames(contractObj.bytecode)
      libraries.map((lib, index) => {
        results.push(
          <ParamInputDiv key={index}>
            {lib}
            <InputBar
              type='text'
              name={lib}
              placeholder='Library Address (0x...)'
              onChange={this.handleLibChange}
              value={this.state.libraries[lib] || ``}
            />
          </ParamInputDiv>,
        )
      })
    }

    results.push(
      <ParamInputDiv key='Notes'>
        Deployment Notes
        <InputBar
          type='text'
          name='Notes'
          placeholder='Optional Notes or Description'
          onChange={this.handleChange}
          value={this.state.notes || ``}
        />
      </ParamInputDiv>,
    )
    method.inputs.map((input, index) => {
      if (input.name === ``) {
        input.name = `param${index}`
      }
      results.push(
        <ParamInputDiv key={input.name}>
          {input.name}
          <InputBar
            type='text'
            name={input.name}
            placeholder={input.type}
            onChange={this.handleChange}
            value={this.getInputValue(input.name)}
          />
        </ParamInputDiv>,
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
      {method.type || `constructor`}(
      {method.inputs.map(input => `${input.type} ${input.name}`).join(`, `)})
      <Div>{method.stateMutability}</Div>
    </Div>
  )

  render() {
    const { method, transactionResult, transactionReceipt } = this.state
    return (
      <MainDiv>
        <DetailsHeader>{this.props.match.params.contract}</DetailsHeader>
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
            Deploy Contract
          </FormattedProgressButton>
        </FunctionParamLayout>
        <Div
          css={{
            width: `100%`,
            borderBottom: `1px solid #979797`,
          }}
        />
        <TransactionResult result={transactionResult} />
        <TransactionError error={this.state.transactionError} />
        <TransactionReceipt {...transactionReceipt} />
      </MainDiv>
    )
  }
}
export default ContractDeployment
