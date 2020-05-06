import { Router } from 'express'
import battleNetService from '../services/BattleNetService'
import { Identity } from '../models'
import { crawlQueue, queueHasRunningJobsForSub } from '../queues'
import expressJwt from 'express-jwt'
import cors from 'cors'
import { JobStatus } from 'bull'

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
  secret: process.env.JWT_SECRET,
  getToken: (req) => {
    const authHeaderName = 'x-attempts-token'
    if (req.headers[authHeaderName] && (req.headers[authHeaderName] as string).split(' ')[0] === 'Bearer') {
      return (req.headers[authHeaderName] as string).split(' ')[1]
    }
  }
}))

app.get('/jobStatus', async (req, res) => {
  if (!req.user.sub) {
    res.status(401).end('Invalid user')
  }

  return res.json({
    running: await queueHasRunningJobsForSub(crawlQueue, req.user.sub)
  })
})

app.get('/queueJob', async (req, res) => {
  if (!req.user.sub) {
    res.status(401).end('Invalid user')
  }
  if (await queueHasRunningJobsForSub(crawlQueue, req.user.sub)) {
    return res.json({
      success: false
    })
  }

  crawlQueue.add({
    sub: req.user.sub
  })
  res.json({
    success: true
  })
})

app.get('/count/:achievementId', async (req, res) => {
  const { achievementId } = req.params

  const identity = await Identity.findOne({ sub: req.user.sub })

  res.json(await battleNetService.countAchievementQuantities(identity, Number(achievementId)))
})


export default app
