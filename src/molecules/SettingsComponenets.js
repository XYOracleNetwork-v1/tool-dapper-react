import glam from "glamorous"

export const SettingsInput = glam.input({
  marginLeft: 10,
  marginRight: 10,
  paddingLeft: 12,
  border: `1px solid #E0E0E0`,
  borderRadius: `6px`,
  backgroundColor: `#F6F6F6`,
  height: 30,
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
  maxWidth: 360,
})
export const SettingsLayout = glam.div({
  color: `#4D4D5C`,
  fontFamily: `PT Sans`,
  flex: 1,
  marginRight: 60,
})
