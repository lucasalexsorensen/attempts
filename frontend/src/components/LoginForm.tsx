import React from "react";
import BattleNetButton from "./BattleNetButton";

export default function LoginForm () {
  const regions = {
    EU: 'EU',
    US: 'US'
  }

  return (
    <div className='m-5' style={{display: 'flex', flexDirection: 'column'}}>
      <div className="input-group m-3" style={{width: '75%', alignSelf: 'center'}}>
        <div className="input-group-prepend">
          <label className="input-group-text">Region</label>
        </div>
        <select className="custom-select" defaultValue={regions.EU}>
          {Object.values(regions).map((r, i) => {
            return <option key={i} value={r}>{r}</option>
          })}
        </select>
      </div>
      <BattleNetButton />
    </div>
  )
}