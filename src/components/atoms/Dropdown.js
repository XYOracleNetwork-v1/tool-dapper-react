import React from 'react'
import glam from 'glamorous'
import Dropdown from 'react-dropdown'
import 'react-dropdown/style.css'

const Btn = glam(Dropdown)(
  {
    '.Dropdown-root': {
      '& .Dropdown-control': {
        position: 'relative',
        overflow: 'hidden',
        color: '#d8d8d8',
        borderRadius: 16,
        height: 60,
        backgroundColor: '#3c3e51',
        cursor: 'default',
        outline: 'none',
        padding: '16px 52px 18px 40px',
        transition: 'all 200ms ease',
        fontSize: '18pt',
        border: 'none',
      },
      '& .Dropdown-arrow': {
        borderColor: '#999 transparent transparent',
        borderStyle: 'solid',
        borderWidth: '5px 5px 0',
        content: `' '`,
        display: 'block',
        marginTop: 12,
        position: 'absolute',
        right: 14,
        top: 14,
        height: 0,
        width: 0,
      },
      '& .Dropdown-menu': {
        backgroundColor: 'white',
        border: '1px solid #ccc',
        marginTop: -1,
        maxHeight: 200,
        overflowY: 'auto',
        position: 'absolute',
        top: '100%',
        width: '100%',
        zIndex: 1000,
      },
    },
  },
  ({ css = {} }) => ({
    '.Dropdown-root': css,
  }),
)

export default Btn
