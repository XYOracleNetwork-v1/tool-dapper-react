import glam from "glamorous"

export const FlexSpacingRow = glam.div({
  display: `flex`,
  flexDirection: `row`,
  justifyContent: `space-between`,
  height: 35,
  color: `#4D4D5C`,
  fontFamily: `PT Sans`,
  fontSize: 15,
})

export const LeftColumn = glam.div({
  textAlign: `left`,
})

export const RightColumn = glam.div({
  textAlign: `right`,
  lineBreak: `loose`,
  wordWrap: `break-word`,
})

export const TableStyle = glam.div({
  width: `90W%`,
  minHeight: `20px`,
  margin: 20,
  padding: 20,
  boxShadow: `0 4px 4px 0 rgba(99, 99, 99, 0.19)`,
  backgroundColor: `white`,
  borderRadius: 2,
})