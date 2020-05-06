import React from 'react'
import LoginForm from './LoginForm'
import { RouteComponentProps, useLocation } from 'react-router-dom'
import jwt from 'jsonwebtoken'

function login (token: string | null): boolean {
  if (!token) return false
  if (!jwt.decode(token)) return false

  localStorage.setItem('jwt', token)

  return true
}

const LoginPage = ({ match, history }: RouteComponentProps) => {
  const params = new URLSearchParams(useLocation().search);
  const token = params.get('token')
  if (token) {
    if (login(token)) {
      history.replace('/')
    } else {
      history.push('/login')
    }
  }

  return (
    <div className='container-md'>
      <div className='card'>
        <LoginForm />
      </div>
    </div>
  )
}


export default LoginPage
