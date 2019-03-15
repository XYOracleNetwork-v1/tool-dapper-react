import React from 'react'
import { Div, Form, H2 } from 'glamorous'
import glam from 'glamorous'

import Button from '../atoms/Button'
import TextInput from '../atoms/TextInput'

const Row = glam.div({
  display: `flex`,
  justifyContent: `space-between`,
  padding: `20px 0`,
  borderBottom: `solid 1px #fff`,
  '&:first-child': {
    color: `#ac6efd`,
    fontSize: 18,
    fontWeight: `bold`,
    paddingTop: 0,
  },
  '&:last-child': {
    paddingBottom: 0,
    border: `none`,
  },
  // the "Value" column
  '& > *:last-child': {
    fontWeight: `bold`,
  },
})

const ContractSimulator = () => (
  <Div css={{ paddingBottom: 50 }}>
    <Form
      onSubmit={e => {
        e.preventDefault()
        console.log(`submit!`, e.target)
      }}
    />
  </Div>
)

export default ContractSimulator
