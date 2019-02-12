import React, { useState, useEffect, memo } from 'react'
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

const Web3HelperExecution = ({
  helpers,
  match: {
    params: { funcId },
  },
  web3,
}) => {
  const [inputs, setInputs] = useState(null)
  const [func, setFunc] = useState(null)
  const [txResult, setTxResult] = useState(null)
  const [txError, setTxError] = useState(null)
  const [txReceipt, setTxReceipt] = useState(null)
  const [executeBtnState, setExecuteBtnState] = useState(STATE.NOTHING)

  const updateInputs = () => {
    const func = helpers.find(f => f.id === Number(funcId))
    setInputs(
      func.inputs.reduce(
        (acc, input) => ({
          [input.name]: '',
        }),
        {},
      ),
    )
    setFunc(func)
    setTxResult(null)
    setTxError(null)
    setExecuteBtnState(STATE.NOTHING)
  }

  useEffect(
    () => {
      updateInputs()
    },
    [funcId],
  )

  const finishExecuting = (error, result) => {
    setTxResult(result)
    setTxError(error)
    setExecuteBtnState(error ? STATE.ERROR : STATE.SUCCESS)
  }

  const handleChange = e => {
    setInputs(inp => {
      const { name: inputName, value } = e.target
      const { ...newInputs } = inp
      newInputs[inputName] = value
      return newInputs
    })
  }

  const executeFunction = async e => {
    e.preventDefault()
    setTxResult(null)
    setTxError(null)
    setTxReceipt(null)
    setExecuteBtnState(STATE.LOADING)
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
        return finishExecuting(null, result)
      })
      if (result) {
        console.log(`GOT RESULT AFTER CALL`, result)
        return finishExecuting(null, result)
      }
    } catch (err) {
      finishExecuting(err)
    }
  }

  if (!func) return <div>Loading...</div>

  return (
    <>
      <h2>{func.name}</h2>
      <div>{func.description}</div>
      <Form
        onSubmit={executeFunction}
        css={{
          display: `flex`,
          flexDirection: `column`,
          paddingBottom: 40,
          borderBottom: `1px solid #979797`,
          width: `100%`,
        }}
      >
        <FunctionParamList>
          {func.inputs.map(({ name, placeholder }) => (
            <ParamInputDiv key={name}>
              <TextInput
                label={name}
                name={name}
                placeholder={placeholder}
                onChange={handleChange}
                value={inputs[name]}
              />
            </ParamInputDiv>
          ))}
        </FunctionParamList>
        <ExecuteFunctionButton state={executeBtnState} type="submit">
          Execute
        </ExecuteFunctionButton>
      </Form>
      {txResult && <ResultDiv title="Result">{stringify(txResult)}</ResultDiv>}
      {txError && <ResultDiv title="Error">{txError.toString()}</ResultDiv>}
      {txReceipt && <TransactionReceipt txReceipt={txReceipt} />}
    </>
  )
}

export default memo(Web3HelperExecution)
