import React from 'react'
import Dropzone from 'react-dropzone'
import { Div } from 'glamorous'
import DroppedFileDiv from '../molecules/DroppedFileDiv'
import './css/FolderDropzone.css'

const { fromEvent } = require(`file-selector`)

const parentStyle = {
  alignSelf: `center`,
  padding: 20,
  width: 400,
  height: 180,
  border: `2px dashed #888`,
}

class FolderDropzone extends React.Component {
  constructor() {
    super()
    this.state = { files: [] }
  }

  onDrop = files => {
    this.setState({
      files,
    })
  }

  render() {
    return (
      <Div style={{ maxWidth: 500 }}>
        <Dropzone
          style={parentStyle}
          getDataTransferItems={evt => fromEvent(evt)}
          onDrop={this.onDrop}
        >
          <h2>Drop ABI Folder here (JSON files)</h2>
          <p> ie. [solidity_project]/build/contracts</p>
        </Dropzone>
        <DroppedFileDiv
          files={this.state.files}
          onSave={hash => this.props.onSave(hash)}
        />
      </Div>
    )
  }
}

export default FolderDropzone
