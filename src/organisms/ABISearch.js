import React from 'react'
import { Div, Form, H2, Label } from 'glamorous'
import { SettingsInput } from '../molecules/SettingsComponenets'
import glam from 'glamorous'
import ProgressButton from 'react-progress-button'
import { keyframes } from 'glamor'

const spin = keyframes({
  '0%': {
    transform: 'rotate(0deg)',
  },
  '100%': {
    transform: 'rotate(360deg)',
  },
})

const Btn = glam(ProgressButton)({
  '.pb-container': {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: 200,
    '& .pb-button': {
      height: 40,
      borderRadius: 25,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      '& svg': {
        width: 40,
        height: 40,
        transform: 'rotate(0deg)',
        '&.pb-progress-circle': {
          animationName: spin,
        },
      },
    },
    '&.loading': {
      '& .pb-button': {
        width: 40,
      },
    },
  },
})

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
      <SettingsInput
        id="ipfs-search"
        placeholder="ipfs.xyo.network"
        css={{ width: 500, marginRight: 25 }}
      />
      <Btn type="submit">Search</Btn>
    </Form>
  </Div>
)

export default ABISearch
