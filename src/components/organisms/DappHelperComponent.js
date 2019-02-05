import React, { Component } from 'react'
import { Div } from 'glamorous'
import { Route, Link } from 'react-router-dom'
import { MainDiv, Vertical } from '../molecules/FunctionDetailsComponents'
import { STATE } from 'react-progress-button'
import TransactionError from '../atoms/TransactionError'
import { TransactionReceipt } from '../atoms/TransactionReceipt'
import DappHelperExecutionComponent from './DappHelperExecutionComponent'
// import  abi  from 'ethereumjs-abi'
const abi = require(`ethereumjs-abi`)

export const defaultHelpers = [
  {
    id: 0,
    name: `sign()`,
    description: `Use your account to sign a message`,
    inputs: [
      {
        name: `Signer`,
        value: undefined,
        type: `address`,
        placeholder: `ie. 0x000...`,
      },
      {
        name: `Message`,
        value: undefined,
        type: `string`,
        placeholder: `ie. This is a test`,
      },
    ],
    method: (web3, address, message, callback) =>
      web3.eth.personal.sign(message, address, callback),
  },
  {
    id: 1,
    name: `now()`,
    description: `Return block time and number`,
    inputs: [],
    method: (web3, callback) => web3.eth.getBlockNumber(callback),
  },
  {
    id: 2,
    name: `kekkak256()`,
    description: `Return hash of input`,
    inputs: [
      {
        name: `Input`,
        value: undefined,
        type: `string`,
        placeholder: `ie. Hash this string`,
      },
    ],
    method: (web3, callback) => web3.utils.keccak256(callback),
  },
  {
    id: 3,
    name: `encodeParameter()`,
    description: `Return abi encoded of two inputs`,
    inputs: [
      {
        name: `type`,
        options: [`address`, `string`, `uint`],
        value: undefined,
        type: `option`,
        placeholder: `The type of parameter (string | address | uint)`,
      },
      {
        name: `parameter`,
        value: undefined,
        type: `string`,
        placeholder: `ie. The actual parameter to encode`,
      },
    ],
    method: (web3, input1, input2, callback) => {
      console.log(web3.eth.abi)
      return `0x${abi
        .soliditySHA3([`address`, `address`], [input1, input2])
        .toString(`hex`)}`
      // return web3.eth.abi.encodeParameter(input1, input2, callback)
    },
  },
  {
    id: 4,
    name: `recover()`,
    description: `Recovers Ethereum address used to sign this data.`,
    inputs: [
      {
        name: `message`,
        value: undefined,
        type: `string`,
        placeholder: `The signed message or hash, already prefixed with "\x19Ethereum Signed Message:\n" + message.length + message.`,
      },
      {
        name: `signature`,
        value: undefined,
        type: `string`,
        placeholder: `The raw RLP encoded signature`,
      },
      {
        name: `isPrefixed`,
        value: false,
        type: `boolean`,
        placeholder: `if true, the given message will NOT automatically be prefixed with "\x19Ethereum Signed Message:\n" + message.length + message`,
      },
    ],
    method: (web3, message, sig, prefixed) =>
      console.log(web3.eth.accounts) ||
      web3.eth.accounts.recover(
        message,
        sig,
        prefixed === `true` || prefixed === `1`,
      ),
  },
]

const ResultDiv = props => {
  return <Div> {props.result}</Div>
}

class DappHelperComponent extends Component {
  state = {
    helpers: defaultHelpers,
  }

  finishExecuting = (error, result) => {
    console.log(`Got result`, result)
    this.setState({
      transactionResult: result,
      transactionError: error,
      executeBtnState: error ? STATE.ERROR : STATE.SUCCESS,
    })
  }

  render() {
    // console.log(`RENDERING DAPP HELPER COMPONENT`)
    const { helpers } = this.state
    return (
      <MainDiv>
        <Div>
          {helpers.map(func => (
            <Div key={func.name} css={{ margin: 20 }}>
              <Link to={`/helpers/${func.id}`}>{func.name}</Link>
              <Div>{func.description}</Div>
            </Div>
          ))}
        </Div>
        <Route
          exact
          path="/helpers/:funcId"
          render={props => (
            <DappHelperExecutionComponent
              {...props}
              service={this.props.service}
              executeHelper={this.finishExecuting}
            />
          )}
        />
        <ResultDiv result={this.state.transactionResult} />
        <TransactionError error={this.state.transactionError} />
        <TransactionReceipt {...this.state.transactionResult} />
      </MainDiv>
    )
  }
}

export default DappHelperComponent
