import React from 'react'
import { useDropzone } from 'react-dropzone'
import { Div, Svg } from 'glamorous'

import DroppedFileDiv from '../molecules/DroppedFileDiv'
import { createBorder } from '../../theme'

const parentStyle = {
  alignSelf: `center`,
  padding: 20,
  height: 200,
  marginRight: 40,
  border: `1px dashed #fff`,
  color: `white`,
  borderImage: createBorder({ color: `white` }),
  background: `rgba(216, 216, 216, 0.22)`,
  cursor: `pointer`,
}

class FolderDropzone extends React.Component {
  state = { files: [] }

  FileDropzone = () => {
    const onDrop = acceptedFiles => {
      this.setState({
        files: acceptedFiles,
      })
    }
    const { getRootProps, getInputProps, isDragActive } = useDropzone({
      onDrop,
    })

    return (
      <Div {...getRootProps()} style={parentStyle}>
        <input {...getInputProps()} />
        <h2>Drop files here</h2>
        <Svg
          css={{
            width: 50,
            height: 50,
            fill: `none`,
            stroke: `white`,
            marginTop: 10,
          }}
          viewBox="0 0 100 100"
        >
          <circle cx="50px" cy="50px" r="40px" strokeWidth="6px" />
          <path strokeWidth="10px" d="M30,50h40 M50,30v40" />
        </Svg>
      </Div>
    )
  }
  render() {
    const { onSave, onError, uploadIPFS } = this.props
    const { files } = this.state
    return (
      <Div style={{ flex: 1 }}>
        <this.FileDropzone />

        <DroppedFileDiv
          files={files}
          onSave={onSave}
          onError={onError}
          uploadIPFS={uploadIPFS}
        />
      </Div>
    )
  }
}

export default FolderDropzone
