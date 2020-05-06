import querystring from 'querystring'
import { decode } from 'jsonwebtoken'
import axios from 'axios'
import * as uuid from 'uuid'
import { BattleNetRegion, BattleNetScope, BattleNetNamespace } from '../enums'
import { Identity } from '../models'
import Statistic from '../models/Statistic.model'
import Queue from 'bull'
import {createQueryBuilder, getRepository} from 'typeorm'

export type BattleNetStatistic = {
  id: number
  name: string
  last_updated_timestamp: number
  quantity: number
}

export type BattleNetCharacter = {
  id: number
  name: string
  level: number
  realm: {
    id: number
    slug: string
  }
}

type CharactersResponse = {
  wow_accounts: [{
    id: number
    characters: BattleNetCharacter[]
  }],
  collections: {
    href: string
  }
}

export type StatisticsResponse = {
  categories: [{
    id: number
    name: string
    sub_categories: [{
      id: number
      name: string
      statistics: BattleNetStatistic[] 
    }]
    statistics: BattleNetStatistic[]
  }]
}

export class BattleNetService {
  private credentials: { id: string, secret: string }
  constructor () {
    this.credentials = {
      id: process.env.BATTLE_NET_CLIENT_ID,
      secret: process.env.BATTLE_NET_CLIENT_SECRET
    }
  }

  getAuthorizeUrl (region: BattleNetRegion, scopes: BattleNetScope[]): string {
    const state = `${region}|${uuid.v4()}`
    const redirect_uri = this.buildRedirectUrl()
    return `https://${region.toLowerCase()}.battle.net/oauth/authorize?` + querystring.stringify({
      client_id: this.credentials.id,
      redirect_uri,
      scope: scopes.join(' '),
      response_type: 'code',
      state
    })
  }

  async handleBnetCallback (req, res): Promise<Identity | null> {
    const { state, code } = req.query
    const region = (state as string).split('|')[0] as BattleNetRegion
    
    try {
      const result = await this.convertCodeToAccessToken(region, code as string)
      const decoded = decode(result.id_token) as {
        sub: string
        battle_tag: string
        exp: number
      }

      const existing = await Identity.findOne({ sub: decoded.sub })
      if (existing) {
        existing.accessToken = result.access_token
        existing.idToken = result.id_token
        existing.exp = decoded.exp
        await existing.save()
        return existing
      } else {
        const identity = new Identity()
        identity.sub = decoded.sub
        identity.exp = decoded.exp
        identity.accessToken = result.access_token
        identity.battletag = decoded.battle_tag
        identity.region = region
        identity.idToken = result.id_token
  
        await identity.save()
        return identity
      }
    } catch (e) {
      console.log('OAuth failure', e)
      return null
    }
  }

  async convertCodeToAccessToken (region: BattleNetRegion, code: string): Promise<{ access_token: string, token_type: string, expires_in: number, scope: string, id_token: string }> {
    const redirect_uri = this.buildRedirectUrl()
    const response = await axios.post(`https://${region.toLowerCase()}.battle.net/oauth/token`, querystring.stringify({
      redirect_uri,
      scope: [BattleNetScope.WOW_PROFILE].join(' '),
      grant_type: 'authorization_code',
      code
    }), {
      auth: {
        username: this.credentials.id,
        password: this.credentials.secret
      }
    })
    return response.data
  }

  isIdentityValid (identity: Identity): boolean {
    return Date.now() < (identity.exp * 1000)
  }

  buildRedirectUrl () {
    return `${process.env.SELF_URL}/auth/bnet/callback`
  }

  buildNamespace (type: BattleNetNamespace, identity: Identity) {
    return `${type}-${identity.region.toLowerCase()}`
  }

  async fetch (identity: Identity, path: string) {
    if (!this.isIdentityValid(identity)) throw new Error('invalid identity')

    return axios.get(`https://${identity.region}.api.blizzard.com/${path}`, {
      headers: {
        'battlenet-namespace': this.buildNamespace(BattleNetNamespace.PROFILE, identity),
        'authorization': `Bearer ${identity.accessToken}`
      },
      params: {
        locale: 'en_US'
      }
    })
  }

  async updateAllCharacters (bullJob: Queue.Job, identity: Identity) {

  }

  async updateCharacter (identity: Identity, realmSlug: string, characterName: string): Promise<boolean> {
    try {
      const { categories } = await this.fetchCharacterStatistics(identity, realmSlug, characterName)

      // nested extraction of categories
      // (could be done recursively, also with recursive TS types.
      //   however, it has a maximal depth of 2, so it's not worth the extra effort imo)
      const statistics = categories.reduce((acc, curr) => {
        if (curr.statistics) {
          acc = acc.concat(curr.statistics)
        }
        if (curr.sub_categories) {
          acc = acc.concat(curr.sub_categories.reduce((acc, curr) => {
            if (curr.statistics) {
              acc = acc.concat(curr.statistics)
            }
            return acc
          }, []))
        }
        return acc
      }, []) as BattleNetStatistic[]
  
      await Promise.all(statistics.map(async statistic => {
        if (!statistic || !statistic.id) console.log('stat', statistic)
        const existing = await Statistic.findOne({ identity: Identity, achievementId: statistic.id })
  
        if (existing) {
          existing.quantity = statistic.quantity
          await existing.save()
        } else {
          const s = new Statistic()
          s.identity = identity
          s.achievementId = statistic.id
          s.quantity = statistic.quantity

          s.realmSlug = realmSlug
          s.characterName = characterName
          await s.save()
        }
      }))

      return true
    } catch (e) {
      console.error('char failed', realmSlug, characterName, e)
      return false
    }
  }

  async fetchCharacters (identity: Identity): Promise<CharactersResponse> {
    const response = await this.fetch(identity, 'profile/user/wow')

    return response.data
  }

  async fetchCharacterStatistics (identity: Identity, realmSlug: string, characterName: string): Promise<StatisticsResponse> {
    const response = await this.fetch(identity, `profile/wow/character/${realmSlug.toLowerCase()}/${characterName.toLowerCase()}/achievements/statistics`)

    return response.data
  }

  async countAchievementQuantities (identity: Identity, achievementId: number) {
    const { sum } = await getRepository(Statistic)
      .createQueryBuilder('statistic')
      .select('SUM(quantity)', 'sum')
      .where('statistic.achievementId = :achId', { achId: achievementId})
      .getRawOne()
    return {
      count: sum
    }
  }

}

const instance = new BattleNetService()
export default instance
