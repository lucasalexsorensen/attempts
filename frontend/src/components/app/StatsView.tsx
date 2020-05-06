import React, { useState } from 'react'
import { Typeahead } from 'react-bootstrap-typeahead'
import 'react-bootstrap-typeahead/css/Typeahead.css'
import stats from '../../stats.json'
import { get } from '../../utils/api'

type Statistic = {
  categoryId: number
  subCategoryId: number
  name: string
  id: number
}

async function statisticSelected (stat: Statistic, setCountResult: Function) {
  const result = await get(`/api/count/${stat.id}`)
  setCountResult({ count: result?.count })
}

export default function StatsView () {
  let [selected, setSelected] = useState(null as Statistic | null)
  let [countResult, setCountResult] = useState(null as { count: number } | null)

  return <React.Fragment>
    <div style={{width: '80%', marginLeft: 'auto', marginRight: 'auto', paddingTop: 15}}>
      <Typeahead
        id='typeahead'
        bsSize={'lg'}
        align={'left'}
        maxResults={20}
        placeholder='Choose a statistic to track'
        options={stats}
        labelKey={'name'}
        minLength={2}
        highlightOnlyResult={true}
        onChange={(sel: any) => {
          setSelected(sel[0])
          statisticSelected(sel[0], setCountResult)
        }}
      />
    </div>
    <hr />
    {(countResult && countResult.count) && (<div>
      <h5>Total count:</h5>
      <h4>{countResult.count}</h4>
    </div>
    )}
  </React.Fragment>
}