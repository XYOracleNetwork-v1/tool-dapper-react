import React from 'react'
import glam from 'glamorous'

const ResultDiv = glam.div({
  height: 78,
  paddingLeft: 35,
  paddingTop: 12,
  fontSize: '25px',
  fontFamily: 'PT Sans',
  color: '#4D4D5C',
})

const TransactionResult = ({ result }) => {
  if (result === undefined) {
    return null
  }
  return <ResultDiv>Result: {JSON.stringify(result, null, 2)} </ResultDiv>
}
export default TransactionResult
