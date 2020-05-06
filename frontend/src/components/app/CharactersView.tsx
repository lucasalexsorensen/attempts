import React from 'react'

type Character = {
  name: string
  realm: string
}

export default function CharactersView () {
  const chars = [] as Character[]
  return <React.Fragment>
    <ul>
      {chars.map(char => {
        return (
          <li key={char.name}>
            {char.name} - {char.realm}
          </li>
        )
      })}
    </ul>
  </React.Fragment>
}