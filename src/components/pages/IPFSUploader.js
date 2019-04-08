import React, { Component, useState } from 'react'
import glam, { Div, H2 } from 'glamorous'

import Button from '../atoms/Button'
import FolderDropzone from '../organisms/FolderDropzone'
import { readSettings } from '../../util/CookieReader'
import JSONUploader from '../molecules/JSONUploader'
import IPFSConfigForm from '../molecules/IPFSConfigForm'

const Heading = glam.h3({
  fontSize: 22,
  fontWeight: `normal`,
})

const IPFSUploader2 = ({
  uploadIPFS,
  ipfsConfig,
  updateIPFSConfig,
  loadIPFSContracts,
}) => {
  const [settings, updateSettings] = useState(() => readSettings())
  const [fileUploadIpfsHash, setFileUploadIpfsHash] = useState(null)
  const [jsonUploadIpfsHash, setJsonUploadIpfsHash] = useState(null)
  const [fileUploadError, setFileUploadError] = useState(null)
  const [jsonUploadError, setJsonUploadError] = useState(null)

  const handleFileUploadError = error => {
    setFileUploadError(error)
    setFileUploadIpfsHash(null)
  }

  const handleJsonUploadError = error => {
    setJsonUploadError(error)
    setJsonUploadIpfsHash(null)
  }

  const handleFileUpload = async ipfsHash => {
    setFileUploadError(null)
    setFileUploadIpfsHash(ipfsHash)
    // await loadIPFSContracts()
  }

  const handleJsonUpload = async ipfsHash => {
    setJsonUploadError(null)
    setJsonUploadIpfsHash(ipfsHash)
    // await loadIPFSContracts()
  }

  return (
    <Div css={{ display: `flex`, flexDirection: `column`, paddingBottom: 25 }}>
      <H2>IPFS Uploader</H2>
      <Div
        css={{
          fontSize: 16,
        }}
      >
        Pin files and JSON to a remote IPFS Node
      </Div>
      <Heading>IPFS Config</Heading>
      <IPFSConfigForm config={ipfsConfig} updateIPFSConfig={updateIPFSConfig} />
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
            onSave={handleFileUpload}
            onError={handleFileUploadError}
            uploadIPFS={uploadIPFS}
          />
        </Div>
        {fileUploadError && <Div>Error: {fileUploadError}</Div>}
        {fileUploadIpfsHash && (
          <Div>
            <Heading>Hash: {fileUploadIpfsHash}</Heading>
            <Button onClick={() => loadIPFSContracts(fileUploadIpfsHash)}>
              Load contracts
            </Button>
          </Div>
        )}
      </Div>
      <Heading>Validate and upload JSON</Heading>
      <Div
        css={{
          marginRight: 40,
        }}
      >
        <JSONUploader
          onSave={handleJsonUpload}
          onError={handleJsonUploadError}
          uploadIPFS={uploadIPFS}
        />
      </Div>
      {jsonUploadError && <Div>Error: {jsonUploadError}</Div>}
      {jsonUploadIpfsHash && (
        <Div>
          Hash: {jsonUploadIpfsHash}
          {` `}
          <Button onClick={() => loadIPFSContracts(jsonUploadIpfsHash)}>
            Load contracts from hash
          </Button>
        </Div>
      )}
    </Div>
  )
}

export default IPFSUploader2
