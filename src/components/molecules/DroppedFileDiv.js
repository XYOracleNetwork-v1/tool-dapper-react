import React, { Component } from 'react'
import { STATE } from 'react-progress-button'
import { Div } from 'glamorous'

import Button from './../atoms/Button'

class DroppedFileDiv extends Component {
  state = {
    uploadBtnState: STATE.NOTHING,
  }

  handleClick = async () => {
    this.setState({ uploadBtnState: STATE.LOADING })
    const { files, onSave, onError, uploadIPFS } = this.props
    const promises = files.map(file => {
      const reader = new FileReader()
      return new Promise((resolve, reject) => {
        reader.onload = () => {
          const fileBuf = new Buffer(reader.result)
          const fileDef = { path: file.name, content: fileBuf }
          resolve(fileDef)
        }
        reader.onabort = () => reject(`file reading was aborted`)
        reader.onerror = () => reject(`file reading has failed`)
        reader.readAsBinaryString(file)
      })
    })
    try {
      const data = await Promise.all(promises)
      const res = await uploadIPFS(data)
      await onSave(res)
      this.setState({ uploadBtnState: STATE.SUCCESS })
    } catch (err) {
      this.setState({ uploadBtnState: STATE.ERROR })
      onError(err)
    }
  }

  render() {
    const { files } = this.props
    const { uploadBtnState } = this.state
    return (
      files.length > 0 && (
        <Div style={{ textAlign: `left` }}>
          <h2>Dropped files and folders</h2>
          <ul>
            {files.map(f => (
              <li key={f.name}>
                {f.path} - {f.size} bytes
              </li>
            ))}
          </ul>
          <Button state={uploadBtnState} onClick={this.handleClick}>
            Upload Files
          </Button>
        </Div>
      )
    )
  }
}

export default DroppedFileDiv
