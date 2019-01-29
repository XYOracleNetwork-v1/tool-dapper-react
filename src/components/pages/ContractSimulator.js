import React, { Component } from 'react'
import { Div, Form, H2 } from 'glamorous'
import { withRouter } from 'react-router-dom'
import { withCookies } from 'react-cookie'
import glam from 'glamorous'

import Input from '../atoms/Input'
import Button from '../atoms/Button'

const Heading = glam.h3({
  fontSize: 22,
  fontWeight: 'normal',
})

const FieldGroup = glam.div({
  marginRight: 40,
  display: 'flex',
  flexDirection: 'column',
  flex: 1,
})

const FieldLabel = glam.label({
  fontSize: 16,
  marginBottom: 10,
})

const Field = ({ label, id, placeholder }) => (
  <FieldGroup>
    <FieldLabel htmlFor={id}>{label}</FieldLabel>
    <Input id={id} placeholder={placeholder} />
  </FieldGroup>
)

class ContractSimulator extends Component {
  state = {}

  render() {
    return (
      <Div css={{}}>
        <Form
          onSubmit={e => {
            e.preventDefault()
            console.log('submit!', e.target)
          }}
        >
          <H2>Deploy DataVault</H2>
          <Field label="Name" id="name" placeholder="string" />
          <Field label="Parameters" id="params" placeholder="string" />
          <Button css={{ marginTop: 40 }} type="submit">
            Deploy Contract
          </Button>
        </Form>
      </Div>
    )
  }
}

export default withCookies(withRouter(ContractSimulator))
