import React from 'react';
import { Div } from 'glamorous';
import Seperator from './Seperator';

const TransactionError = ({ error }) => {
  if (error === undefined) return null;
  return (
    <Div>
      <Seperator />
      {error.toString()}
    </Div>
  );
};
export default TransactionError;
