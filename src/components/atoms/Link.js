import { Link as NavLink } from 'react-router-dom'
import glam from 'glamorous'

const Link = glam(NavLink)({
  color: 'inherit',
  cursor: 'pointer',
})

export default Link
