import React from "react"
import Dropzone from "react-dropzone"
import { Div } from "glamorous"
import uploadIPFS from "./IPFSUploader"
import ProgressButton, { STATE } from "react-progress-button"
import "./css/FolderDropzone.css"

const { fromEvent } = require(`file-selector`)

class DroppedFileDiv extends React.Component {
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
      promises.push(new Promise((resolve, reject) => {
        reader.onload = () => {
          const fileBuf = new Buffer(reader.result)
          data.push({ path: file.name, content: fileBuf })
          resolve(true)
        }
        reader.onabort = () => reject(`file reading was aborted`)

        reader.onerror = () => reject(`file reading has failed`)

        reader.readAsBinaryString(file)
      }))
    })

    return Promise.all(promises)
      .then(async () => {
        return uploadIPFS(data)
      })
      .then(ipfsHash => {
        return this.props.onSave(ipfsHash)
      })
      .then(() => this.setState({ uploadBtnState: STATE.SUCCESS }))
      .catch((err) => {
        console.log(`SOME ERR`, err)
        this.setState({ uploadBtnState: STATE.ERROR })
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

const parentStyle = {
  alignSelf: `center`,
  padding: 20,
  width: 400,
  height: 200,
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
      <Div>
        <Dropzone
          style={parentStyle}
          getDataTransferItems={evt => fromEvent(evt)}
          onDrop={this.onDrop}
          >
          <h2>
              Drop ABI Folder here
          </h2>
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
