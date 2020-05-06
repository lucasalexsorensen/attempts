import path from 'path'
import dotenv from 'dotenv'
dotenv.config({ path: path.resolve(__dirname, '../.env') })

import express from 'express'
import { createConnection } from 'typeorm'
import { Identity } from './models'
import Statistic from './models/Statistic.model'
import { setQueues } from 'bull-board'
import api from './routes/api'
import admin from './routes/admin'
import auth from './routes/auth'
import { crawlQueue } from './queues'
setQueues([crawlQueue])

const app = express()

// load routes
app.use('/api', api)
app.use('/admin', admin)
app.use('/auth', auth)

// public routes
app.use(express.static(path.resolve('./') + '/build/frontend'))
app.get('/', (req, res) => {
  res.sendFile(path.resolve('./') + '/build/frontend/index.html')
})

async function init () {
  // connect to postgres
  await createConnection({
    type: 'postgres',
    url: process.env.DATABASE_URL,
    entities: [Identity, Statistic],
    synchronize: true
  })
}

init().then(() => {
  // open for traffic
  const port = process.env.PORT || 8000
  app.listen(port)
  console.log('Listening on port ' + port)
}).catch(console.error)

export default app