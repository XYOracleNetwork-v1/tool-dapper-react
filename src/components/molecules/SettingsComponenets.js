import glam from 'glamorous'

export const SettingsInput = glam.input({
  // display: `flex`,
  // flexDirection: `row`,
  // marginLeft: 10,
  // marginRight: 10,
  // paddingLeft: 12,
  borderRadius: 6,
  backgroundColor: `#F6F6F6`,
  height: 40,
  border: 'none',
  padding: '10px 20px',
  fontSize: 14,
  color: '#9b9b9b',
})

export const RowLayout = glam.div({
  display: `flex`,
  flexDirection: `row`,
  paddingRight: 20,
  marginBottom: 40,
  marginLeft: 40,
})

export const InputText = glam.div({
  display: `inline`,
  marginTop: `10`,
  minWidth: `fit-content`,
})
export const CenterColumn = glam.div({
  lineHeight: 1,
  flex: 1,
  maxWidth: 390,
})
export const SettingsLayout = glam.div({
  flex: 1,
  marginRight: 60,
  paddingBottom: 25,
})
