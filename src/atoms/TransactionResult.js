import React from 'react';
import { Div } from 'glamorous';
import Seperator from './Seperator';

const TransactionResult = ({ result }) => {
  if (result === undefined) {
    return null;
  }

  return (
    <Div>
      <Seperator />
      Execution Result:
      {' '}
      {result.toString() ? result.toString() : 'null'}
    </Div>
  );
};
export default TransactionResult;
