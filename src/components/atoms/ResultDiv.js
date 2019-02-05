import React from 'react'
import { H2, Div } from 'glamorous'
import { lightPurple } from '../../theme'

const ResultDiv = ({ children, title }) => (
  <Div
    css={{
      padding: '10px 0',
      fontSize: 18,
    }}
  >
    <H2 css={{ color: lightPurple }}>{title}</H2>
    {children}
  </Div>
)

export default ResultDiv
