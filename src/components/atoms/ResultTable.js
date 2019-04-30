import React from 'react'
import glam from 'glamorous'
import Anchor from './Anchor'
import Link from './Link'

const TableRoot = glam.div({
  borderRadius: 2,
  boxShadow: `0 4px 4px 0 rgba(99,99,99,0.19)`,
  backgroundColor: `rgba(255,255,255,0.05)`,
  padding: 20,
  fontSize: 14,
})

const Row = glam.div(
  {
    display: `flex`,
    justifyContent: `space-between`,
    padding: `20px 0`,
    borderBottom: `solid 1px #fff`,
    '&:first-child': {
      color: `#ac6efd`,
      fontSize: 18,
      fontWeight: `bold`,
      paddingTop: 0,
    },
    '&:last-child': {
      paddingBottom: 0,
      border: `none`,
    },
    // the "Value" column
    '& > *:last-child': {
      fontWeight: `bold`,
      paddingLeft: 20,
    },
  },
  ({ color }) => ({
    '&:first-child': {
      color,
    },
  }),
)

const MaybeLink = ({ href, to, children }) => {
  if (to) return <Link to={to}>{children}</Link>
  if (href) {
    return (
      <Anchor href={href} target="_blank">
        {children}
      </Anchor>
    )
  }
  return <div>{children}</div>
}

export const Table = ({ header: { name, value, color }, rows }) => (
  <TableRoot>
    <Row color={color}>
      <div>{name}</div>
      <div>{value}</div>
    </Row>
    {rows.map(({ name, value, linkTo, url }) => {
      // value can be a big number if coming from web3
      const coercedValue = value && value.toString ? value.toString() : value
      return (
        <Row key={`${name}-${coercedValue}`}>
          <div>{name}</div>
          <MaybeLink to={linkTo} href={url}>
            {coercedValue}
          </MaybeLink>
        </Row>
      )
    })}
  </TableRoot>
)

export default Table
