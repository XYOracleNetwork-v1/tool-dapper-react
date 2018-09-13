import React, { Component } from 'react'
import glam, { Div, Input, Button } from 'glamorous'
import { BigNumber } from 'bignumber.js'
import { contractNamed, currentUser } from '../web3'
import TransactionResult from '../atoms/TransactionResult'
import TransactionError from '../atoms/TransactionError'
import { TransactionReceipt } from '../atoms/TransactionReceipt'

const FunctionHeaderDiv = glam.div({
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  height: 78,
  paddingLeft: 24,
  fontSize: '25px',
})

const FunctionPropertiesDiv = glam.div({
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'flexStart',
  lineHeight: '30px',
  paddingLeft: '20px',
  fontSize: '16px',
  width: 280,
})

const FunctionParamLayout = glam.div({
  display: 'flex',
  flexDirection: 'row',
  paddingBottom: '30px',
  borderBottom: '1px solid #979797',
})
const FunctionParamList = glam.div({
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'flex-start',
  paddingLeft: 50,
})

class FunctionDetails extends Component {
  state = {
    method: {
      inputs: [],
      outputs: [],
      name: 'loading...',
      type: '',
    },
    transactionResult: undefined,
    transactionReceipt: undefined,
    transactionError: undefined,
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
      this.contract = contractNamed(contractName)
      if (this.contract) {
        const { _jsonInterface } = this.contract
        const newMethod = this.methodObject(_jsonInterface, methodSig)
        if (newMethod) {
          this.setState({
            method: newMethod,
            transactionResult: undefined,
            transactionError: undefined,
            transactionReceipt: undefined,
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

    const newInputs = method.inputs.map(input => {
      if (input.name === e.target.name) {
        return { ...input, value: e.target.value }
      }
      return input
    })
    const newMethod = method
    newMethod.inputs = newInputs
    this.setState({ method: newMethod })
  }

  handleExecute = async () => {
    const { method } = this.state

    this.setState({
      transactionResult: undefined,
      transactionError: undefined,
      transactionReceipt: undefined,
    })

    const methodName = method.name
    const { inputs, stateMutability } = method
    const inputParams = inputs.map(i => {
      if (['uint256', 'uint128', 'uint64'].includes(i.type)) {
        if (!Number.isNaN(i.value)) {
          return new BigNumber(i.value)
        }
      }
      return i.value
    })

    try {
      if (!currentUser) {
        throw new Error('No Current User, Refresh Page, or Login Metamask')
      }
      if (
        inputParams.length === 0 ||
        stateMutability === 'view' ||
        stateMutability === 'pure'
      ) {
        const result = await this.contract.methods[methodName](
          ...inputParams,
        ).call()
        this.setState({ transactionResult: result })
      } else {
        this.contract.methods[methodName](...inputParams)
          .send({ from: currentUser })
          .then(transactionReceipt => {
            this.setState({ transactionReceipt })
          })
      }
    } catch (e) {
      this.setState({ transactionError: e })
    }
  }

  render() {
    const {
      method,
      transactionResult,
      transactionReceipt,
      transactionError,
    } = this.state
    return (
      <Div
        css={{
          color: '#4D4D5C',
          fontFamily: 'PT Sans',
          flex: 1,
          overflow: 'auto',
        }}
      >
        <FunctionHeaderDiv>
          {method.name}
          ()
        </FunctionHeaderDiv>
        <FunctionParamLayout>
          <FunctionPropertiesDiv>
            {method.name}(
            {method.inputs
              .map(input => `${input.type} ${input.name}`)
              .join(', ')}
            )<Div>{method.stateMutability}</Div>
            {method.outputs.map(
              output => `returns (${output.type} ${output.name})`,
            )}
          </FunctionPropertiesDiv>
          <FunctionParamList>
            {method.inputs.map(input => (
              <Div
                css={{
                  marginTop: 8,
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'flex-start',
                }}
                key={input.name}
              >
                {input.name}{' '}
                <Input
                  css={{
                    marginTop: 8,
                    marginRight: 8,
                    paddingLeft: 8,
                    border: '1px solid #E0E0E0',
                    borderRadius: '6px',
                    backgroundColor: '#F6F6F6',
                    width: 290,
                    height: 40,
                  }}
                  name={input.name}
                  placeholder={input.type}
                  onChange={this.handleChange}
                />
              </Div>
            ))}
          </FunctionParamList>

          <Button
            css={{
              justifyContent: 'space-around',
              alignContent: 'center',
              color: 'white',
              backgroundColor: '#5B5C6D',
              height: 40,
              width: '200px',
              marginLeft: 'auto',
              marginRight: 44,
              marginTop: 'auto',
              marginBottom: 0,
              borderRadius: 9,
              fontSize: 14,
            }}
            onClick={this.handleExecute}
          >
            EXECUTE
          </Button>
        </FunctionParamLayout>

        <TransactionResult result={transactionResult} />
        <TransactionError error={transactionError} />
        <TransactionReceipt {...transactionReceipt} />
      </Div>
    )
  }
}
export default FunctionDetails
