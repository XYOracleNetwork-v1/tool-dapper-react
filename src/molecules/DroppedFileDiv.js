import React, { Component } from 'react'
import uploadIPFS from '../util/IPFSUploader'
import ProgressButton, { STATE } from 'react-progress-button'
import { withCookies } from 'react-cookie'
import { Div } from 'glamorous'

class DroppedFileDiv extends Component {
  state = {
    uploadBtnState: STATE.NOTHING,
  }

  handleClick = async () => {
    console.log(`Data submitted`)
    this.setState({ uploadBtnState: STATE.LOADING })
    let data = []
    let { files } = this.props

    let promises = []
    files.forEach(file => {
      const reader = new FileReader()
      promises.push(
        new Promise((resolve, reject) => {
          reader.onload = () => {
            const fileBuf = new Buffer(reader.result)
            data.push({ path: file.name, content: fileBuf })
            resolve(true)
          }
          reader.onabort = () => reject(`file reading was aborted`)

          reader.onerror = () => reject(`file reading has failed`)

          reader.readAsBinaryString(file)
        }),
      )
    })

    return Promise.all(promises)
      .then(async () => {
        return uploadIPFS(this.props.cookies, data)
      })
      .then(ipfsHash => {
        return this.props.onSave(ipfsHash)
      })
      .then(() => {
        console.log(`WTFFFF`)
        this.setState({ uploadBtnState: STATE.SUCCESS })
      })
  }

  render() {
    let { files } = this.props
    if (files.length > 0) {
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
          <ProgressButton
            state={this.state.uploadBtnState}
            onClick={this.handleClick}
          >
            Upload Contracts
          </ProgressButton>
        </Div>
      )
    }
    return null
  }
}

export default withCookies(DroppedFileDiv)
