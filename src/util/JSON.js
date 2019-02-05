export const stringify = (json, replacer = null, space = 2) =>
  JSON.stringify(json, replacer, space)

export const parse = json => JSON.parse(json)
