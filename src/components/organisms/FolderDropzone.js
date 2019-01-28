import React from 'react'
import Dropzone from 'react-dropzone'
import { Div, Svg } from 'glamorous'

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
  cursor: 'pointer',
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
          <div>ie. [solidity_project]/build/contracts</div>
          <Svg
            css={{
              width: 50,
              height: 50,
              fill: 'none',
              stroke: 'white',
              marginTop: 10,
            }}
            viewBox="0 0 100 100"
          >
            <circle cx="50px" cy="50px" r="40px" strokeWidth="6px" />
            <path strokeWidth="10px" d="M30,50h40 M50,30v40" />
          </Svg>
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
