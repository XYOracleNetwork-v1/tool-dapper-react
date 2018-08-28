import React, { Component } from 'react';
import { Div, Input, Button } from 'glamorous';
import { BigNumber } from 'bignumber.js';
import { contractNamed, currentUser } from '../web3';
import TransactionResult from '../atoms/TransactionResult';
import TransactionError from '../atoms/TransactionError';
import { TransactionReceipt } from '../atoms/TransactionReceipt';

class MethodItem extends Component {
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
  };

  contract = {};

  componentDidMount() {
    this.updateInputs();
  }

  componentDidUpdate() {
    this.updateInputs();
  }

  updateInputs = () => {
    const { match } = this.props;
    const { method } = this.state;
    const { signature } = method;

    const methodSig = match.params.method;

    if (signature !== methodSig) {
      const contractName = match.params.contract;
      this.contract = contractNamed(contractName);
      const { _jsonInterface } = this.contract;
      const newMethod = this.methodObject(_jsonInterface, methodSig);
      if (newMethod) {
        this.setState({
          method: newMethod,
          transactionResult: undefined,
          transactionError: undefined,
          transactionReceipt: undefined,
        });
      }
    }
  };

  methodObject = (methods, sig) => {
    const methodObj = methods.find(method => method.signature === sig);
    if (methodObj) {
      return methodObj;
    }
    return undefined;
  };

  handleChange = (e) => {
    const { method } = this.state;

    const newInputs = method.inputs.map((input) => {
      if (input.name === e.target.name) {
        return { ...input, value: e.target.value };
      }
      return input;
    });
    const newMethod = method;
    newMethod.inputs = newInputs;
    this.setState({ method: newMethod });
  };

  handleExecute = async () => {
    const { method } = this.state;

    this.setState({
      transactionResult: undefined,
      transactionError: undefined,
      transactionReceipt: undefined,
    });

    const methodName = method.name;
    const { inputs, stateMutability } = method;
    const inputParams = inputs.map((i) => {
      if (['uint256', 'uint128', 'uint64'].includes(i.type)) {
        if (!Number.isNaN(i.value)) {
          return new BigNumber(i.value);
        }
      }
      return i.value;
    });

    try {
      if (!currentUser) {
        throw new Error('No Current User, Refresh Page, or Login Metamask');
      }
      if (inputParams.length === 0 || stateMutability === 'view' || stateMutability === 'pure') {
        const result = await this.contract.methods[methodName](...inputParams).call();
        this.setState({ transactionResult: result });
      } else {
        this.contract.methods[methodName](...inputParams)
          .send({ from: currentUser })
          .then((transactionReceipt) => {
            this.setState({ transactionReceipt });
          });
      }
    } catch (e) {
      this.setState({ transactionError: e });
    }
  };

  render() {
    const {
      method, transactionResult, transactionReceipt, transactionError,
    } = this.state;
    return (
      <Div
        css={{
          display: 'flex',
          justifyContent: 'left',
          alignContent: 'left',
          flexDirection: 'column',
          textAlign: 'left',
        }}
      >
        <h3>
          {method.name}
        </h3>

        <Div>
          {method.name}
(
          {method.inputs.map(input => `${input.type} ${input.name}`).join(', ')}
)
        </Div>
        <Div>
          {method.stateMutability}
        </Div>
        <Div>
          {method.outputs.map(output => `returns (${output.type} ${output.name})`)}
        </Div>
        {method.inputs.map(input => (
          <Div key={input.name}>
            {input.name}
            {' '}
            <Input name={input.name} placeholder={input.type} onChange={this.handleChange} />
          </Div>
        ))}
        <Button css={{ margin: 20 }} onClick={this.handleExecute}>
          Execute
        </Button>
        <TransactionResult result={transactionResult} />
        <TransactionError error={transactionError} />
        <TransactionReceipt {...transactionReceipt} />
      </Div>
    );
  }
}
export default MethodItem;
