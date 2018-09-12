import React from 'react'
import glam from 'glamorous'

const ResultDiv = glam.div({
  height: 78,
  padding: 35,
  fontSize: '18px',
  fontFamily: 'PT Sans',
  color: '#4D4D5C',
})

const TransactionError = ({ error }) => {
  if (error === undefined) return null
  return <ResultDiv>{error.toString()}</ResultDiv>
}
export default TransactionError
