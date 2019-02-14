import React, { Component } from 'react'
import { Div } from 'glamorous'
import { STATE } from 'react-progress-button'
import DeploymentResult from '../atoms/DeploymentResult'
import { TransactionReceipt } from '../atoms/TransactionReceipt'
import { HeaderStyle } from '../atoms/HeaderStyle'
import {
  MainDiv,
  FunctionParamLayout,
  FunctionPropertiesDiv,
  FunctionParamList,
  ParamInputDiv,
  Horizontal,
  ExecuteFunctionButton,
} from '../molecules/FunctionDetailsComponents'
import TextInput from '../atoms/TextInput'
import ResultDiv from '../atoms/ResultDiv'

class ContractDeployment extends Component {
  state = {
    method: {
      inputs: [],
      outputs: [],
      name: `loading...`,
      type: ``,
      executeBtnState: STATE.NOTHING,
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

  updateInputs = () => {
    const { match } = this.props
    const { contractName } = match.params
    let contract = this.state.service.contractObject(contractName)
    if (contract && this.state.method.executeBtnState === STATE.NOTHING) {
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

  deployContract = async () => {
    const { user, createContract, getContractObject, match } = this.props

    const inputParams = this.state.inputs
      ? this.state.inputs.map(i => i.value)
      : []
    let contractObj = getContractObject(match.params.contractName)
    let bytecode = contractObj.bytecode
    let contract = createContract(contractObj.abi)

    let libraries = Object.entries(this.state.libraries)
    if (libraries.length > 0) {
      libraries.forEach(lib => {
        bytecode = this.linkLibrary(bytecode, lib[0], lib[1])
      })
    }
    console.log(
      `DEPLOYING WITH bytecode`,
      contract,
      bytecode,
      inputParams,
      user,
      this.state.value,
    )
    console.log(`THE VALUE IS `, this.state.value)
    try {
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
          function(error, receipt) {
            console.log(`Finished Deploy Call`, error, receipt)
          },
        )
        .then(newContractInstance => {
          this.setState({
            executeBtnState: STATE.SUCCESS,
            transactionResult: {
              address: newContractInstance.address,
              ipfs: contractObj.ipfs,
              name: contractObj.name,
              notes: this.state.notes,
            },
          })
          // this.props.service.addDeployedContract(
          //   contractObj.ipfs,
          //   contractObj.name,
          //   newContractInstance.address,
          //   bytecode,
          //   contractObj.abi,
          //   this.state.notes,
          // )
          this.props.service.addDeployedContract({
            ipfs: contractObj.ipfs,
            name: contractObj.name,
            address: newContractInstance.address,
            bytecode,
            abi: contractObj.abi,
            notes: this.state.notes,
          })
          this.props.onDeploy({
            notes: this.state.notes,
            address: newContractInstance.address,
          })
          console.log(
            `Created New Instance`,
            newContractInstance,
            contractObj.ipfs,
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
    } catch (error) {
      console.log(`error`, error)
      this.setState({
        executeBtnState: STATE.ERROR,
        transactionError: error,
      })
    }
  }

  handleExecute = e => {
    e.preventDefault()
    this.setState({
      transactionResult: undefined,
      transactionError: undefined,
      transactionReceipt: undefined,
      executeBtnState: STATE.LOADING,
    })
    console.log(`EXECUTE TAPPED`)
    try {
      const { user } = this.props

      if (!user) {
        let e = new Error(`Please connect a wallet`)
        console.log(`ERR`, e)

        this.setState({
          executeBtnState: STATE.ERROR,
          transactionError: e,
        })
        return
      }

      this.deployContract()
    } catch (e) {
      console.log(`ERR`, e)
      this.setState({
        executeBtnState: STATE.ERROR,
        transactionError: e,
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
      this.props.match.params.contractName,
    )
    const results = []

    if (contractObj) {
      let libraries = this.findLibraryNames(contractObj.bytecode)
      libraries.forEach((lib, index) => {
        results.push(
          <ParamInputDiv key={index}>
            {lib}
            <TextInput
              name={lib}
              placeholder="Library Address (0x...)"
              onChange={this.handleLibChange}
              value={this.state.libraries[lib] || ``}
            />
          </ParamInputDiv>,
        )
      })
    }

    results.push(
      <ParamInputDiv key="Notes">
        Deployment Notes
        <TextInput
          name="Notes"
          placeholder="Optional Notes or Description"
          onChange={this.handleChange}
          value={this.state.notes || ``}
        />
      </ParamInputDiv>,
    )
    method.inputs.forEach((input, index) => {
      if (input.name === ``) {
        input.name = `param${index}`
      }
      results.push(
        <ParamInputDiv key={input.name}>
          {input.name}
          <TextInput
            type="text"
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
        <ParamInputDiv key="Value">
          Value To Transfer
          <TextInput
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

  functionProperties = method => (
    <Div>
      {method.type || `constructor`}(
      {method.inputs.map(input => `${input.type} ${input.name}`).join(`, `)})
      <Div>{method.stateMutability}</Div>
    </Div>
  )

  render() {
    const {
      match: {
        params: { contractName },
      },
    } = this.props
    const {
      method,
      transactionResult,
      transactionReceipt,
      executeBtnState,
      transactionError,
    } = this.state
    return (
      <MainDiv>
        <HeaderStyle>{contractName}</HeaderStyle>
        <FunctionParamLayout>
          <Horizontal>
            <FunctionPropertiesDiv>
              {this.functionProperties(method)}
            </FunctionPropertiesDiv>
            <FunctionParamList>{this.getInputs(method)}</FunctionParamList>
          </Horizontal>

          <ExecuteFunctionButton
            state={executeBtnState}
            onClick={this.handleExecute}
          >
            Deploy Contract
          </ExecuteFunctionButton>
        </FunctionParamLayout>
        {/* <Div
          css={{
            width: `100%`,
          }}
        /> */}
        <DeploymentResult {...transactionResult} />
        {transactionError && (
          <ResultDiv title="Error">{transactionError.message}</ResultDiv>
        )}
        {transactionReceipt && (
          <TransactionReceipt transactionReceipt={transactionReceipt} />
        )}
      </MainDiv>
    )
  }
}

export default ContractDeployment
