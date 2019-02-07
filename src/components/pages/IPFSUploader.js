import React, { Component } from 'react'
import glam, { Div, H2 } from 'glamorous'
import { withCookies } from 'react-cookie'

import Button from '../atoms/Button'
import FolderDropzone from '../organisms/FolderDropzone'
import { readSettings } from '../../util/CookieReader'
import JSONUploader from '../molecules/JSONUploader'
import IPFSConfigForm from '../molecules/IPFSConfigForm'

const Heading = glam.h3({
  fontSize: 22,
  fontWeight: 'normal',
})

class IPFSUploader extends Component {
  state = {
    ...readSettings(this.props.cookies),
  }

  handleUpload = async ipfsHash => {
    const { loadIPFSContracts } = this.props
    this.setState({ ipfsHash })
    await loadIPFSContracts()
  }

  saveIPFSContracts = async () => {}

  setError = error => this.setState({ error })

  render() {
    const { uploadIPFS, ipfsConfig, updateIPFSConfig } = this.props
    const { error, ipfsHash } = this.state
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
        <IPFSConfigForm
          config={ipfsConfig}
          updateIPFSConfig={updateIPFSConfig}
        />
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
              onSave={this.handleUpload}
              onError={this.handleError}
              uploadIPFS={uploadIPFS}
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
            onSave={this.handleUpload}
            setError={this.handleError}
          />
        </Div>
        {error && <Div>{error}</Div>}
        {ipfsHash && <Div>{ipfsHash}</Div>}
      </Div>
    )
  }
}

export default withCookies(IPFSUploader)
