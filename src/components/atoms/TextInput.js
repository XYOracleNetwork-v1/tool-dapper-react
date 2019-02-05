import React from 'react'
import glam from 'glamorous'

import Input from './Input'

const FieldGroup = glam.div({
  display: 'flex',
  flexDirection: 'column',
  flex: 1,
  marginBottom: 40,
})

const FieldLabel = glam.label({
  fontSize: 16,
  marginBottom: 20,
})

const TextInput = ({ label, id, css, className, ...props }) => (
  <FieldGroup css={css} className={className}>
    <FieldLabel htmlFor={id}>{label}</FieldLabel>
    <Input id={id} {...props} />
  </FieldGroup>
)

export default TextInput
