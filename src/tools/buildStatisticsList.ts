
// README
//
// This script generates a list of all statistics based on an actual response from the API
// (since Blizzard's static APIs only support achievement data and not statistic data)
// In this case, we are borrowing statistics from a neckbeard character with a lot of achievements
//
// USAGE (must be from root dir): node build/tools/buildStatisticsList.js

import path from 'path'
import fs from 'fs'
import { StatisticsResponse } from '../services/BattleNetService'

const paths = {
  responseFile: path.join(__dirname, '../../src/tools', 'xirev-vash-05-06-2020.json'),
  outPath: path.join(__dirname, '../../src/tools', 'stats.json'),
  frontendPath: path.resolve(__dirname, '../../frontend/src/stats.json')
}

const data = JSON.parse(fs.readFileSync(paths.responseFile).toString('utf8')) as StatisticsResponse
const result = JSON.stringify(data.categories.reduce((acc, curr) => {
  if (curr.statistics) {
    acc = acc.concat(curr.statistics.map(c => {
      return {categoryId: curr.id, name: c.name, id: c.id, subCategoryId: null }
    }))
  }
  if (curr.sub_categories) {
    acc = acc.concat(curr.sub_categories.reduce((subAcc, subCurr) => {
      if (curr.statistics) {
        subAcc = subAcc.concat(subCurr.statistics.map(c => {
          return { categoryId: curr.id, name: c.name, id: c.id, subCategoryId: subCurr.id }
        }))
      }
      return subAcc
    }, []))
  }

  return acc
}, []) as {
  categoryId: number
  subCategoryId: number
  name: string
}[])

fs.writeFileSync(paths.outPath, result)
fs.writeFileSync(paths.frontendPath, result)

