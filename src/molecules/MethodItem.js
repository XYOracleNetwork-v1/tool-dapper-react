import React, {Component} from 'react'
import { contractNamed } from '../web3'
import { Div, Input, Button} from 'glamorous'
import {Seperator} from '../atoms/Seperator'
import {BigNumber} from 'bignumber.js';

const TransactionResult = ({result}) => {
    if (result === undefined) return null
    return (
        <Div>
            <Seperator />
            Execution Result: {result.toString()}
        </Div>
    )
}

 export class MethodItem extends Component  {
    state = {
        method : {inputs: [], outputs: [], name:'loading...'},
        executeResult : undefined,
        transactionResult : undefined,
        transactionError: undefined
    }
    contract = {}

    componentDidMount() {
        this.updateInputs()
    }
    componentDidUpdate() {
        this.updateInputs()
    }

    updateInputs = () => {
        let { match } = this.props
        let methodSig = match.params.method

        if (this.state.method.signature !== methodSig) {
            let contractName = match.params.contract
            this.contract = contractNamed(contractName)
            let method = this.methodObject(this.contract._jsonInterface, methodSig)
            if (method) {
                this.setState({method, transactionResult: undefined, transactionError: undefined})
            }
        }
    }

    methodObject = (methods, sig) => {
        let methodObj = methods.find(method => method.signature === sig)
        if (methodObj) {
          return methodObj
        }
        return undefined
    }

    handleChange = e => {
        let newInputs = this.state.method.inputs.map(input => {
            if (input.name === e.target.name) {
                return { ...input, value: e.target.value}
            }
            return input
        })
        let newMethod = this.state.method
        newMethod.inputs = newInputs
        this.setState({method : newMethod})
    }

    handleExecute = async e => {
        let methodName = this.state.method.name
        let {inputs} = this.state.method

        let inputParams = inputs.map(i=>{
            console.log("Parsing Param", i)
            if (['uint256', 'uint128', 'uint64'].includes(i.type)) {
                return new BigNumber(i.value)
            }
            return i.value
        })
        console.log("Executing Passing inputParams", inputs, inputParams)

        try {

             let result = await this.contract.methods[methodName](...inputParams).call()
             console.log("RESULT", result)

             this.setState({transactionResult: result})
        } catch(e) {
            console.log("Error:", e)
            this.setState({transactionError: e})
        }
    }

    render() {
        console.log("Method Render", this.state)
        return <Div css = {{ 
          display: 'flex',
          justifyContent: 'left',
          alignContent: 'left',
          flexDirection: 'column',
          textAlign: 'left',
        }}>
          <Div>
            {this.state.method.name}({ this.state.method.inputs.map(input=>{ 
                return `${input.type} ${input.name}`
                
                }).join(", ") }
            ) </Div>
            <Div>
            {this.state.method.stateMutability}
            </Div>
            <Div>
            { this.state.method.outputs.map(output=>{ 
                return `returns (${output.type} ${output.name})`
                })
            }
            </Div>
            {this.state.method.inputs.map(input => {
                return <Div key={input.name}>
                {input.name} <Input 
                name={input.name}
                placeholder={input.type} 
                onChange={this.handleChange}>
                </Input>
                </Div>
                
            })}
            <Button
                css = {{ margin: 20}}
                onClick={this.handleExecute}>
                Execute
            </Button>
            <TransactionResult result={this.state.transactionResult}/>
          </Div>
    }

  }
