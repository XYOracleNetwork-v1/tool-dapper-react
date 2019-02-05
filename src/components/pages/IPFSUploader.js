import React, { Component } from 'react'
import glam, { Div, Form, H2, Textarea } from 'glamorous'
import { withCookies } from 'react-cookie'

import Button from '../atoms/Button'
import TextInput from '../atoms/TextInput'
import FolderDropzone from '../organisms/FolderDropzone'
import { readSettings } from '../../util/CookieReader'
import JSONUploader from '../molecules/JSONUploader'

const StyledTextInput = glam(TextInput)({ marginRight: 40 })

const Heading = glam.h3({
  fontSize: 22,
  fontWeight: 'normal',
})

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
            <StyledTextInput
              label="Host"
              id="host"
              placeholder="ipfs.xyo.network"
            />
            <StyledTextInput label="Port" id="port" placeholder="5002" />
            <StyledTextInput
              label="Protocol"
              id="protocol"
              placeholder="https"
            />
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
