import React, { Component } from 'react'

import { storiesOf } from '@storybook/react'
import glam, { Div } from 'glamorous'

import ResultTable from '../ResultTable.js'

const header = {
  value: 'Stuff',
  name: 'Blah',
  color: '#AAAAAA',
}
const rows = [
  {
    name: 'Row1',
    value: 'asdfasdf',
  },
  {
    name: 'Row2',
    value: 'asdfawerqwetsg',
  },
  {
    name: 'Row3',
    value: 'Stsdgfsdfgsdfhsdfhuff',
  },
]
storiesOf('ResultTable', module)
  .add('default', () => <ResultTable header={header} rows={rows} />)
  .add('multiple', () => (
    <Div
      css={{
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center',
      }}
    >
      <Div
        css={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          width: '94%',
        }}
      >
        <ResultTable header={header} rows={rows} />
        <ResultTable header={header} rows={rows} />
        <ResultTable header={header} rows={rows} />
      </Div>
    </Div>
  ))
