import React, { Component } from 'react'
import { Div } from 'glamorous'
import './css/ResultTable.css'
import Seperator from './Seperator'
import { Link } from 'react-router-dom'
import {
  TableStyle,
  FlexSpacingRow,
  LeftColumn,
  RightColumn,
} from '../atoms/SharedStyles'

const HeaderRow = ({ header }) => {
  const { name, value, color } = header
  return (
    <FlexSpacingRow
      css={{
        color: color,
        fontSize: 18,
        paddingBottom: 12,
      }}
    >
      <LeftColumn>{name}</LeftColumn>
      <RightColumn>{value}</RightColumn>
    </FlexSpacingRow>
  )
}

export const RowDivs = ({ rows }) => {
  const rowDivs = []
  rows.forEach(({ name, value, linkTo, url }, index) => {
    let seperator = undefined
    if (index < rows.length - 1) {
      seperator = <Seperator />
    }
    let rightColumn = value => {
      if (linkTo) {
        return <RightColumn>{<Link to={linkTo}>{value}</Link>}</RightColumn>
      } else if (url) {
        return (
          <RightColumn>
            {
              <a href={url} target="blank">
                {value}
              </a>
            }
          </RightColumn>
        )
      }
      return <RightColumn>{value}</RightColumn>
    }
    rowDivs.push(
      <Div key={index}>
        <FlexSpacingRow>
          <LeftColumn>{name}</LeftColumn>
          {rightColumn(value)}
        </FlexSpacingRow>
        {seperator}
      </Div>,
    )
  })

  return <Div>{rowDivs}</Div>
}

class ResultTable extends Component {
  render() {
    const { header, rows } = this.props
    return (
      <TableStyle>
        <HeaderRow header={header} />
        <RowDivs rows={rows} />
      </TableStyle>
    )
  }
}

export default ResultTable
