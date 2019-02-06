import React from 'react'
import { Redirect } from 'react-router-dom'

const Login = ({ user, location: { state = { from: { pathname: '/' } } } }) => {
  const { from } = state
  return user ? (
    <Redirect to={from} />
  ) : (
    <div>Please log in with your wallet</div>
  )
}

export default Login
