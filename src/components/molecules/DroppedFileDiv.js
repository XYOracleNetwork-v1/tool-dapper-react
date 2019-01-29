import React, { Component } from 'react'
import uploadIPFS from '../../util/IPFSUploader'
import ProgressButton, { STATE } from 'react-progress-button'
import { withCookies } from 'react-cookie'
import { Div } from 'glamorous'

class DroppedFileDiv extends Component {
  state = {
    uploadBtnState: STATE.NOTHING,
  }

  handleClick = async () => {
    this.setState({ uploadBtnState: STATE.LOADING })
    const { files, cookies, onSave } = this.props
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
    const data = await Promise.all(promises)
    const res = await uploadIPFS(cookies, data)
    await onSave(res)
    this.setState({ uploadBtnState: STATE.SUCCESS })
  }

  render() {
    const { files } = this.props
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
          <ProgressButton
            state={this.state.uploadBtnState}
            onClick={this.handleClick}
          >
            Upload Contracts
          </ProgressButton>
        </Div>
      )
    )
  }
}

export default withCookies(DroppedFileDiv)
