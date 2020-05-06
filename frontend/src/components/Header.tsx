import React from 'react'
import jwt from 'jsonwebtoken'
import { useHistory } from 'react-router-dom'

function renderBattletag (battletag: string | null, redirect: Function) {
  if (!battletag) return

  return (
    <span style={{position: 'absolute', right: 50, top: 50}}>
      {battletag} | <span className='link' onClick={() => {
        localStorage.removeItem('jwt')
        redirect()

      }}>Sign out</span>
    </span>
  )
}

export default function Header () {
  let battletag = null
  const history = useHistory()

  const token = localStorage.getItem('jwt')
  if (token) {
    const d = jwt.decode(token) as null | { battletag: string }
    if (d && d.battletag) {
      battletag = d.battletag
    }
  }

  return (
    <header>
      <h1 className='lobster m-5'>attempts</h1>

      {renderBattletag(battletag, () => history.replace('/login'))}
    </header>
  )
}
