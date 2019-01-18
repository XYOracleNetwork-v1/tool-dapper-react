import React from 'react'
import { Div, Form, H2, Label } from 'glamorous'

import Button from './../atoms/Button'
import Input from './../atoms/Input'

const ABISearch = () => (
  <Div css={{ display: 'flex', flexDirection: 'column' }}>
    <H2 css={{ marginBottom: 45 }}>Search for Smart Contract</H2>
    <Label css={{ fontSize: 16, marginBottom: 10 }} htmlFor="ipfs-search">
      Search description/name/hash
    </Label>
    <Form
      id="ipfs-search-form"
      css={{ display: 'flex' }}
      onSubmit={e => {
        e.preventDefault()
        console.log('foo')
      }}
    >
      <Input
        id="ipfs-search"
        placeholder="ipfs.xyo.network"
        css={{ width: 500, marginRight: 25 }}
      />
      <Button type="submit">Search</Button>
    </Form>
  </Div>
)

export default ABISearch
