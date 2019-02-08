import React, { Component } from 'react'
import {
  FunctionParamList,
  ParamInputDiv,
  ExecuteFunctionButton,
} from '../molecules/FunctionDetailsComponents'
import { STATE } from 'react-progress-button'

import TextInput from '../atoms/TextInput'
import { stringify } from '../../util/JSON'
import { TransactionReceipt } from '../atoms/TransactionReceipt'
import ResultDiv from '../atoms/ResultDiv'
import { Form } from 'glamorous'
import asyncSetState from '../../util/asyncSetState'

class Web3HelperExecution extends Component {
  constructor(props) {
    super(props)
    this.state = {
      executeBtnState: STATE.NOTHING,
    }
  }

  componentDidMount() {
    this.updateInputs()
  }

  componentDidUpdate(prevProps) {
    const {
      match: {
        params: { funcId: prevFuncId },
      },
      network: prevNetwork,
    } = prevProps
    const {
      match: {
        params: { funcId },
      },
      network,
    } = this.props
    if (prevFuncId !== funcId || prevNetwork !== network) {
      this.updateInputs()
    }
  }

  shouldComponentUpdate(nextProps, nextState) {
    const {
      match: {
        params: { funcId: nextFuncId },
      },
      network: nextNetwork,
    } = nextProps
    const {
      match: {
        params: { funcId },
      },
      network,
    } = this.props
    const {
      func: nextFunc,
      transactionResult: nextTransactionResult,
      transactionError: nextTransactionError,
    } = nextState
    const { func, transactionResult, transactionError } = this.state
    return (
      nextFuncId !== funcId ||
      nextNetwork !== network ||
      nextFunc !== func ||
      transactionResult !== nextTransactionResult ||
      transactionError !== nextTransactionError
    )
  }

  updateInputs = () => {
    const {
      helpers,
      match: {
        params: { funcId },
      },
    } = this.props
    const func = helpers.find(f => f.id === Number(funcId))
    const inputs = func.inputs.reduce(
      (acc, input) => ({
        [input.name]: '',
      }),
      {},
    )
    this.setState({
      inputs,
      func,
      transactionResult: null,
      transactionError: null,
      executeBtnState: STATE.NOTHING,
    })
  }

  handleChange = e => {
    const { inputs } = this.state
    const { name: inputName, value } = e.target
    const { ...newInputs } = inputs
    newInputs[inputName] = value
    this.setState({ inputs: newInputs })
  }

  getInputs = () => {
    const { func, inputs } = this.state
    return func.inputs.map(({ name, placeholder }) => (
      <ParamInputDiv key={name}>
        <TextInput
          label={name}
          name={name}
          placeholder={placeholder}
          onChange={this.handleChange}
          value={inputs[name]}
        />
      </ParamInputDiv>
    ))
  }

  executeFunction = async e => {
    e.preventDefault()
    const { web3 } = this.props
    const { inputs, func } = this.state
    await asyncSetState(this.setState.bind(this), {
      transactionResult: null,
      transactionError: null,
      transactionReceipt: null,
      executeBtnState: STATE.LOADING,
    })
    try {
      console.log(`EXECUTING HERE`, inputs)
      const inputParams = Object.entries(inputs).map(([name, value]) => value)
      if (!web3) {
        throw new Error(`Please connect a wallet`)
      }
      console.log(`EXECUTING INPUT PARAMS`, inputParams)

      const result = await func.method(web3, ...inputParams, (err, result) => {
        console.log(`WHAT IS THE RESULT:`, result)
        if (err) {
          throw new Error(err)
        }
        return this.finishExecuting(null, result)
      })
      if (result) {
        console.log(`GOT RESULT AFTER CALL`, result)
        return this.finishExecuting(null, result)
      }
    } catch (err) {
      this.finishExecuting(err)
    }
  }

  finishExecuting = (error, result) => {
    this.setState({
      transactionResult: result,
      transactionError: error,
      executeBtnState: error ? STATE.ERROR : STATE.SUCCESS,
    })
  }

  render() {
    const {
      transactionResult,
      transactionError,
      executeBtnState,
      func,
    } = this.state
    if (!func) return <div>Loading...</div>

    return (
      <>
        <h2>{func.name}</h2>
        <div>{func.description}</div>
        <Form
          onSubmit={this.executeFunction}
          css={{
            display: `flex`,
            flexDirection: `column`,
            paddingBottom: 40,
            borderBottom: `1px solid #979797`,
            width: `100%`,
          }}
        >
          <FunctionParamList>{this.getInputs()}</FunctionParamList>
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
        {transactionResult && (
          <TransactionReceipt transactionReceipt={transactionResult} />
        )}
      </>
    )
  }
}

export default Web3HelperExecution
