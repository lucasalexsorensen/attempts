import React from 'react';
import bnetLogo from '../images/bnet-logo.png'

export default function BattleNetButton () {
  return (
    <a
      id="bnet-button"
      role="button"
      className="btn btn-lg btn-primary"
      style={{color: 'white', width: '30%', alignSelf: 'center'}}
      href={`${process.env.REACT_APP_API_URL}/auth/bnet`}
    >
      <img src={bnetLogo} width={50} height={50} style={{filter: 'invert()', marginRight: 10}} alt='bnet logo' />
      Sign in with Battle.net
    </a>
  )
}