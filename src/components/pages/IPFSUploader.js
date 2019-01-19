import React from 'react'
import glam, { Div, Form, H2, H3, Label } from 'glamorous'

import Button from '../atoms/Button'
import Input from '../atoms/Input'

const Heading = glam.h3({
  fontSize: 22,
  fontWeight: 'normal',
})

const FieldGroup = glam.div({
  marginRight: 40,
  display: 'flex',
  flexDirection: 'column',
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

const IPFSUploader = () => (
  <Div css={{ display: 'flex', flexDirection: 'column' }}>
    <H2>IPFS Uploader</H2>
    <Div
      css={{
        fontSize: 16,
      }}
    >
      Pin files and JSON to a remote IPFS Node
    </Div>
    <Heading>IPFS Config</Heading>
    <Form
      id="ipfs-config-form"
      onSubmit={e => {
        e.preventDefault()
        console.log('foo')
      }}
    >
      <Div css={{ display: 'flex', marginBottom: 25 }}>
        <Field label="Host" id="host" placeholder="ipfs.xyo.network" />
        <Field label="Port" id="port" placeholder="5002" />
        <Field label="Protocol" id="protocol" placeholder="https" />
      </Div>
      <Button type="submit">Save</Button>
    </Form>
  </Div>
)

export default IPFSUploader
