import { Router } from 'express'
import battleNetService from '../services/BattleNetService'
import jwt from 'jsonwebtoken'
import { BattleNetRegion, BattleNetScope } from '../enums'
import { crawlQueue, queueHasRunningJobsForSub } from '../queues'
const scopes = [BattleNetScope.WOW_PROFILE, BattleNetScope.OPENID]

const app = Router()

app.get('/bnet', async (req, res) => {
  const region = (req.query.region as BattleNetRegion) || BattleNetRegion.EU
  
  res.redirect(battleNetService.getAuthorizeUrl(region, scopes))
})

app.get('/bnet/callback', async (req, res) => {
  const { identity } = await battleNetService.handleBnetCallback(req, res)
  if (identity) {
    const id = jwt.sign({
      sub: identity.sub,
      battletag: identity.battletag
    }, process.env.JWT_SECRET, {
      expiresIn: '7d'
    })
    const running = await queueHasRunningJobsForSub(crawlQueue, identity.sub)
    if (!running) {
      await crawlQueue.add({
        sub: identity.sub
      })
    }

    return res.redirect(`${process.env.CLIENT_URL}/#/login?token=${id}`)
  }
  res.end('done!')
})

export default app