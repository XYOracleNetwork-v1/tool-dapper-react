import React from 'react'
import Dropzone from 'react-dropzone'
import { Div } from 'glamorous'

import DroppedFileDiv from '../molecules/DroppedFileDiv'
import './css/FolderDropzone.css'
import { createBorder } from '../../theme'

const { fromEvent } = require(`file-selector`)

const parentStyle = {
  alignSelf: `center`,
  padding: 20,
  // width: 400,
  height: 180,
  marginRight: 40,
  border: `1px dashed #fff`,
  // borderImage: `url(${borderSmall}) 2 round`,
  color: 'white',
  borderImage: createBorder({ color: 'white' }),
  background: 'rgba(216, 216, 216, 0.22)',
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
      <Div style={{ flex: 1 }}>
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
