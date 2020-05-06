import path from 'path'
import dotenv from 'dotenv'
dotenv.config({ path: path.resolve(__dirname, '../.env') })

import Queue from 'bull'
import battleNetService, { BattleNetCharacter } from './services/BattleNetService'
import { Identity } from './models'
import BluebirdPromise from 'bluebird'
import { createConnection } from 'typeorm'
import Statistic from './models/Statistic.model'

const crawlQueue = new Queue('crawl', process.env.REDIS_URL)

async function init () {
  // connect to postgres
  await createConnection({
    type: 'postgres',
    url: process.env.DATABASE_URL,
    entities: [Identity, Statistic],
    synchronize: true
  })

  crawlQueue.process(async (job: Queue.Job) => {
    const identity = await Identity.findOne({ sub: job.data.sub })
    const characters = (await battleNetService.fetchCharacters(identity)).wow_accounts.reduce((acc, curr) => {
      acc = acc.concat(curr.characters)
      return acc
    }, []) as BattleNetCharacter[]
  
    await job.log('Processing ' + characters.length)
    let counter = 0
    let failed = 0
    await BluebirdPromise.map(characters, async char => {
      const result = await battleNetService.updateCharacter(identity, char.realm.slug, char.name)
      if (!result) failed++
      counter++
      await job.progress(100 * counter / characters.length)
    }, { concurrency: 20 })

    await job.log('Total failed: ' + failed)
  })

  console.log('listening!')
}

init().then(console.log).catch(console.error)