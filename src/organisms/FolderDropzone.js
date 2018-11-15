import React from 'react'
import Dropzone from 'react-dropzone'
import { Div } from 'glamorous'
import uploadIPFS from './IPFSUploader'
import { DetailsButton } from '../atoms/DetailsButton'
const { fromEvent } = require(`file-selector`)

const handleSubmit = (data, onSave) => {
  console.log(`Data submitted`)
  return uploadIPFS(data).then((ipfsHash) => {
    onSave(ipfsHash)
  })
}
const DroppedFileDiv = ({ files, onSave }) => {
  if (files.length == 0) {
    return null
  }

  const data = []
  files.forEach(file => {
    const reader = new FileReader()
    reader.onload = () => {
      const fileAsBinaryString = new Buffer(reader.result)
      data.push({ path: file.name, content: fileAsBinaryString })
    }
    reader.onabort = () => console.log(`file reading was aborted`)
    reader.onerror = () => console.log(`file reading has failed`)

    reader.readAsBinaryString(file)
  })
  return (
    <Div style={{ textAlign: `left` }}>
      <h2>Dropped files and folders</h2>
      <ul>
        {files.map(f => (
          <li key={f.name}>
            {f.path} - {f.size} bytes
          </li>
        ))}
      </ul>
      <DetailsButton
        css={{ display: `flex`, marginTop: 50 }}
        type='submit'
        onClick={() => handleSubmit(data, onSave)}
      >
        Updload To IPFS
      </DetailsButton>
    </Div>
  )
}
const parentStyle = {
  alignSelf:`center`,
  padding:20,
  width: 400,
  height: 200,
  border: `2px dashed #888`,
}

class FolderDropzone extends React.Component {
  constructor() {
    super()
    this.state = { files: [] }
  }

  onDrop = (files) => {
    this.setState({
      files,
    })
  }

  render() {
    return (
      <Div>
        <Div>
          <Dropzone
            style={
              parentStyle
            }
            getDataTransferItems={evt => fromEvent(evt)}
            onDrop={this.onDrop}
          >
            <Div style={{
              fontSize: 18,
              fontWeight: 800,
              marginTop:50
            }}>Drop ABI Folder here </Div>
            <p> ie. [solidity_project]/build/contracts</p>
          </Dropzone>
        </Div>
        <DroppedFileDiv files={this.state.files} 
          onSave={(hash) => this.props.onSave(hash)} />
      </Div>
    )
  }
}

export default FolderDropzone
