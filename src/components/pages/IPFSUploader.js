import React, { Component } from 'react'
import glam, { Div, Form, H2, Textarea } from 'glamorous'
import { withCookies } from 'react-cookie'

import Button from '../atoms/Button'
import Input from '../atoms/Input'
import FolderDropzone from '../organisms/FolderDropzone'
import { readSettings } from '../../util/CookieReader'
import JSONUploader from '../molecules/JSONUploader'

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

class IPFSUploader extends Component {
  state = {
    ...readSettings(this.props.cookies),
  }

  stateChange = (stateKey, stateValue) => {
    console.log(`attempting State Change`, stateKey, stateValue)
    this.props.cookies.set(stateKey, stateValue, {
      path: `/`,
    })

    this.setState({ [stateKey]: stateValue })
  }

  render() {
    const { service, cookies } = this.props
    const { error } = this.state
    console.log({ error })

    return (
      <Div
        css={{ display: 'flex', flexDirection: 'column', paddingBottom: 25 }}
      >
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
        <Heading>IPFS File</Heading>
        <Div>
          <Div
            css={{
              marginBottom: 20,
              display: `flex`,
              justifyContent: `left`,
              align: `center`,
              textAlign: `center`,
            }}
          >
            <FolderDropzone
              onSave={async ipfsHash => {
                this.stateChange(`ipfs`, ipfsHash)
                await service.loadIPFSContracts(cookies)
              }}
            />
          </Div>
          <Button>Upload File</Button>
        </Div>
        <Heading>Validate and upload JSON</Heading>
        <Div
          css={{
            marginRight: 40,
          }}
        >
          <JSONUploader
            onSave={async ipfsHash => {
              console.log('finished uploading!!', ipfsHash)
              // this.stateChange(`ipfs`, ipfsHash)
              // await service.loadIPFSContracts(cookies)
            }}
            setError={error => this.setState({ error })}
          />
        </Div>
        {error && <Div>{error}</Div>}
      </Div>
    )
  }
}

export default withCookies(IPFSUploader)
