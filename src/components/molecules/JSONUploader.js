import React, { Component } from 'react'
import { STATE } from 'react-progress-button'
import { withCookies } from 'react-cookie'
import { Div, Form, Textarea } from 'glamorous'

import Button from '../atoms/Button'
import uploadIPFS from '../../util/IPFSUploader'

class JSONUploader extends Component {
  state = {
    uploadBtnState: STATE.NOTHING,
    data: '',
  }

  handleSubmit = async () => {
    this.setState({ uploadBtnState: STATE.LOADING })
    try {
      const { cookies, onSave } = this.props
      const { data } = this.state
      // parse then stringify for simple validation
      const res = await uploadIPFS(
        cookies,
        Buffer.from(JSON.stringify(JSON.parse(data))),
      )
      onSave(res)
      this.setState({ uploadBtnState: STATE.SUCCESS })
    } catch (err) {
      console.error(err)
      this.setState({ uploadBtnState: STATE.ERROR })
    }
  }

  handleChange = e => this.setState({ data: e.target.value })

  render() {
    const { data } = this.state
    const { uploadBtnState } = this.state
    return (
      <Form
        id="ipfs-upload-json"
        onSubmit={e => {
          e.preventDefault()
          this.handleSubmit()
        }}
      >
        <Textarea
          css={{
            marginBottom: 20,
            height: 240,
            width: '100%',
            padding: 20,
          }}
          placeholder={`{\n\tjsonKeys: values\n}`}
          value={data}
          onChange={this.handleChange}
        />
        <Button state={uploadBtnState}>Upload JSON</Button>
      </Form>
    )
  }
}

export default withCookies(JSONUploader)
