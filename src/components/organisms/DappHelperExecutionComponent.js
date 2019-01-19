import { withRouter } from 'react-router-dom'
import React, { Component } from 'react'
import {
  FunctionParamLayout,
  FunctionParamList,
  InputBar,
  ParamInputDiv,
  Horizontal,
  FormattedProgressButton,
} from '../molecules/FunctionDetailsComponents'
import { Div } from 'glamorous'
import { defaultHelpers } from './DappHelperComponent'

class DappHelperExecutionComponent extends Component {
  getFunc = () =>
    defaultHelpers.find(f => f.id === Number(this.props.match.params.funcId))

  state = {
    funcId: this.props.match.params.funcId,
    helpers: defaultHelpers,
    transactionResult: undefined,
    inputs: [],
  }

  defaultProps = {
    funcId: `Loading...`,
  }

  componentWillUpdate() {
    this.updateInputs()
  }

  updateInputs = () => {
    if (this.props.match.params.funcId != this.state.funcId) {
      this.setState({
        funcId: this.props.match.params.funcId,
        inputs: [],
      })
    }
  }

  getInputValue = name => {
    let val = ``
    const input = this.state.inputs.find(i => i.name == name)
    val = input ? (input.value ? input.value : ``) : ``
    return val
  }

  handleChange = e => {
    const inputs =
      this.state.inputs && this.state.inputs.length > 0
        ? this.state.inputs
        : this.getFunc().inputs

    const newInputs = inputs.map(input => {
      if (input.name === e.target.name) {
        return { ...input, value: e.target.value }
      }
      return input
    })
    this.setState({ inputs: newInputs })
  }

  getInputs = () => {
    const results = []
    this.getFunc().inputs.forEach((input, i2) => {
      results.push(
        <ParamInputDiv key={i2}>
          <InputBar
            type="text"
            name={input.name}
            placeholder={input.placeholder}
            onChange={this.handleChange}
            value={this.getInputValue(input.name)}
          />
        </ParamInputDiv>,
      )
    })

    return (
      <Div>
        {this.getFunc().name}
        {results}
      </Div>
    )
  }

  executeFunction = async () => {
    console.log(`EXECUTING HERE`, this.state.inputs)

    const inputParams = this.state.inputs.map(i => i.value)
    const web3 = this.props.service.web3
    if (!web3) {
      let e = new Error(`Please connect a wallet`)
      return this.props.executeHelper(e, undefined)
    }
    console.log(`EXECUTING INPUT PARAMS`, inputParams)

    let result = await this.getFunc().method(
      web3,
      ...inputParams,
      (err, result) => {
        console.log(`WHAT IS THE RESULT:`, result)
        if (err) {
          return this.props.executeHelper(err, undefined)
        }
        return this.props.executeHelper(undefined, result)
      },
    )
    if (result) {
      console.log(`GOT RESULT AFTER CALL`, result)
      return this.props.executeHelper(undefined, result)
    }
  }

  render() {
    return (
      <FunctionParamLayout>
        <Horizontal>
          <FunctionParamList>{this.getInputs()}</FunctionParamList>
        </Horizontal>

        <FormattedProgressButton
          state={this.state.executeBtnState}
          onClick={this.executeFunction}
        >
          Execute
        </FormattedProgressButton>
      </FunctionParamLayout>
    )
  }
}

export default withRouter(DappHelperExecutionComponent)
