import React from 'react'
import glam from 'glamorous'

const ResultDiv = glam.div({
  height: 78,
  padding: 35,
  maxWidth: 500,
  fontSize: 18,
})

const TransactionError = ({ error }) => {
  if (error === undefined) return null
  return <ResultDiv>{error.toString()}</ResultDiv>
}
export default TransactionError
