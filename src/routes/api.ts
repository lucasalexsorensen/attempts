import { Router } from 'express'
import battleNetService from '../services/BattleNetService'
import { Identity } from '../models'
import { crawlQueue } from '../queues'
import expressJwt from 'express-jwt'
import cors from 'cors'

const app = Router()
app.use(cors())

declare global {
  namespace Express {
    interface Request {
       user?: {
         sub: string
       }
    }
  }
}

app.use(expressJwt({
  secret: process.env.JWT_SECRET
}))

app.get('/queue', async (req, res) => {
  if (req.user.sub) {
    crawlQueue.add({
      sub: req.user.sub
    })
    res.end('queued!')
  } else {
    res.status(401).end('Invalid user')
  }
})

app.get('/count/:achievementId', async (req, res) => {
  const { achievementId } = req.params

  const identity = await Identity.findOne({ sub: req.user.sub })

  res.json(await battleNetService.countAchievementQuantities(identity, Number(achievementId)))
})


export default app
