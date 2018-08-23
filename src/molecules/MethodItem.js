import React, {Component} from 'react'
import { contractNamed, currentUser } from '../web3'
import { Div, Input, Button} from 'glamorous'
import {BigNumber} from 'bignumber.js';
import { TransactionResult } from '../atoms/TransactionResult'
import { TransactionError } from '../atoms/TransactionError'
import { TransactionReceipt } from '../atoms/TransactionReceipt'


export class MethodItem extends Component  {
    state = {
        method : {inputs: [], outputs: [], name:'loading...', type:''},
        executeResult : undefined,
        transactionResult : undefined,
        // transactionReceipt : {transactionHash: '0x111', events: {DataStored:{event:"DataStored", returnValues:{"0":"0x0000000000000000000000000000000000000000","1":"0x3D01dDdB4eBD0b521f0E4022DCbeF3cb9bc20FF2","2":"31937949962695524","_from":"0x0000000000000000000000000000000000000000","_to":"0x3D01dDdB4eBD0b521f0E4022DCbeF3cb9bc20FF2","_tokenId":"31937949962695524"}}}},
        transactionReceipt : undefined,
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
        let { match } = this.props
        let methodSig = match.params.method

        if (this.state.method.signature !== methodSig) {
            let contractName = match.params.contract
            this.contract = contractNamed(contractName)
            let method = this.methodObject(this.contract._jsonInterface, methodSig)
            if (method) {
                this.setState({method, transactionResult: undefined, transactionError: undefined, transactionReceipt: undefined})
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
        this.setState({transactionResult: undefined, transactionError: undefined, transactionReceipt: undefined})

        let methodName = this.state.method.name
        let {inputs, stateMutability} = this.state.method
        let inputParams = inputs.map(i=>{
            if (['uint256', 'uint128', 'uint64'].includes(i.type)) {
                if (!isNaN(i.value)) {
                    return new BigNumber(i.value)
                }
            }
            return i.value
        })
        console.log("Executing method", currentUser, this.state.method)

        try {
            if (!currentUser) {
                throw new Error("No Current User, Refresh Page, or Login Metamask")
            }
            if (inputParams.length === 0 || stateMutability === 'view' || stateMutability === 'pure') {
                let result = await this.contract.methods[methodName](...inputParams).call()
                this.setState({transactionResult: result})
                console.log("RESULT", result)
            } else {
                this.contract.methods[methodName](...inputParams).send({from: currentUser})
                .then( transactionReceipt => {
                    console.log(" Got Receipt!", transactionReceipt);
                    this.setState({ transactionReceipt })
               })
            }

        } catch(e) {
            this.setState({transactionError: e})
        }
    }

    render() {
        return <Div css = {{ 
          display: 'flex',
          justifyContent: 'left',
          alignContent: 'left',
          flexDirection: 'column',
          textAlign: 'left',
        }}>
            <h3>{this.state.method.name}</h3>

            <Div>
                {this.state.method.name}({ this.state.method.inputs.map(input=>{ 
                    return `${input.type} ${input.name}`
                    
                    }).join(", ") }
                ) 
            </Div>
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
            <TransactionError error={this.state.transactionError} />
            <TransactionReceipt {...this.state.transactionReceipt} />
          </Div>
    }
}
