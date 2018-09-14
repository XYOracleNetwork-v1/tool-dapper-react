import React, { Component } from 'react'
import glam, { Div } from 'glamorous'
import './css/ResultTable.css'
import Seperator from './Seperator'

const ReceiptRow = glam.div({
  display: 'flex',
  flexDirection: 'row',
  justifyContent: 'space-between',
  height: 35,
  color: '#4D4D5C',
  fontFamily: 'PT Sans',
  fontSize: 15,
})
const LeftColumn = glam.div({
  textAlign: 'left',
})
const RightColumn = glam.div({
  textAlign: 'right',
})

const HeaderRow = ({ header }) => {
  const { name, value, color } = header
  return (
    <ReceiptRow
      css={{
        color: color,
        fontSize: 18,
        paddingBottom: 12,
      }}
    >
      <LeftColumn>{name}</LeftColumn>
      <RightColumn>{value}</RightColumn>
    </ReceiptRow>
  )
}

export const RowDivs = ({ rows }) => {
  const rowDivs = []
  rows.forEach(({ name, value }, index) => {
    console.log('INDEX', index)
    let seperator = undefined
    if (index < rows.length - 1) {
      seperator = <Seperator />
    }
    rowDivs.push(
      <Div>
        <ReceiptRow key={name}>
          <LeftColumn>{name}</LeftColumn>
          <RightColumn>{value}</RightColumn>
        </ReceiptRow>
        {seperator}
      </Div>,
    )
  })

  return <Div>{rowDivs}</Div>
}

class ResultTable extends Component {
  constructor({ header, rows }) {
    super()
    this.state = {
      header,
      rows,
    }
  }
  render() {
    return (
      <Div className="result-table">
        <HeaderRow header={this.state.header} />
        <RowDivs rows={this.state.rows} />
      </Div>
    )
  }
}

export default ResultTable
