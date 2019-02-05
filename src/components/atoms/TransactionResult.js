import React from 'react'
import glam, { H2 } from 'glamorous'
import { lightPurple } from '../../theme'

const ResultDiv = glam.div({
  padding: '10px 0',
  fontSize: 18,
})

const TransactionResult = ({ result }) => (
  <ResultDiv>
    <H2 css={{ color: lightPurple }}>Result</H2>
    {JSON.stringify(result, null, 2)}
  </ResultDiv>
)

export default TransactionResult
