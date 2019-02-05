import React from 'react'
import glam, { H2 } from 'glamorous'
import { lightPurple } from '../../theme'

const ResultDiv = glam.div({
  padding: '25px 0',
  fontSize: 18,
})

const TransactionError = ({ error }) => (
  <ResultDiv>
    <H2 css={{ color: lightPurple }}>Error</H2>
    {error.toString()}
  </ResultDiv>
)

export default TransactionError
