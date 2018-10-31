const express = require('express')
const path = require('path')
const passport = require('passport')
const BnetStrategy = require('passport-bnet').Strategy
const jwt = require('express-jwt')
const app = express()
const jsonwebtoken = require('jsonwebtoken')
const log = (...args) => console.log(`[attempts]`, ...args)
const axios = require('axios')
const cors = require('cors')
require('dotenv').config()

const HOSTNAME = process.env.HOSTNAME || 'http://localhost'
const PORT = process.env.PORT || 3000

const REGION = 'eu'
// const BATTLE_NET_URL = `https://${REGION}.battle.net`
const BLIZZARD_URL = `https://${REGION}.api.blizzard.com`

if (!process.env['BNET_CLIENT_ID'] || !process.env['BNET_SECRET']) {
  log('No battle.net Oauth credentials found in env')
  process.exit()
}

if (!process.env['JWT_SECRET']) {
  log('No JWT secret found in env')
  process.exit()
}

app.use(cors())
app.use(passport.initialize())

passport.serializeUser((user, done) => {
  done(null, user)
})

passport.deserializeUser((obj, done) => {
  done(null, obj)
})

passport.use(new BnetStrategy({
  clientID: process.env['BNET_CLIENT_ID'],
  clientSecret: process.env['BNET_SECRET'],
  callbackURL: `${HOSTNAME}:${PORT}/auth/bnet/callback`,
  scope: 'wow.profile',
  region: REGION
}, (accessToken, refreshToken, profile, done) => {
  log('Received OAuth login:', profile)
  return done(null, profile)
}))

app.get('/auth/bnet', passport.authenticate('bnet'))

app.get('/auth/bnet/callback', passport.authenticate('bnet', { session: false }), (req, res) => {
  const token = jsonwebtoken.sign(req.user, process.env['JWT_SECRET'], {
    issuer: 'attempts',
    expiresIn: '7d'
  })

  res.redirect(`${HOSTNAME}:${PORT}/app/#/?token=${encodeURIComponent(token)}`)
})

app.use(jwt({
  secret: process.env['JWT_SECRET'],
  credentialsRequired: true,
  getToken: (req) => {
    if (req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer') {
      return req.headers.authorization.split(' ')[1]
    } else if (req.query && req.query.token) {
      return req.query.token
    }
    return null
  }
}).unless({ path: [
  '/',
  /\/app(\/)?/gi,
  '/auth/bnet',
  '/auth/bnet/callback'
] }))

app.use(function (err, req, res, next) {
  if (err.name === 'UnauthorizedError') {
    res.status(401).send('invalid token...')
  }
})

app.get('/', (req, res) => {
  res.redirect('/app')
})

app.get('/api/characters', async (req, res) => {
  // res.json({ characters: [{ name: 'Dorrough', level: 120 }, { name: 'Søfen', level: 113 }] })
  const characters = await axios.get(`${BLIZZARD_URL}/wow/user/characters`, {
    headers: {
      'Authorization': `Bearer ${req.user.token}`
    }
  })
  res.json(characters.data)
})

app.get('/api/character/:realm/:name/statistics', async (req, res) => {
  const statistics = await axios.get(`${BLIZZARD_URL}/wow/character/${req.params.realm}/${req.params.name}?fields=statistics`, {
    headers: {
      'Authorization': `Bearer ${req.user.token}`
    }
  })
  res.json(statistics.data)
})

app.use('/app', express.static('dist'))

log('Listening @ ', `${HOSTNAME}:${PORT}`)
app.listen(PORT)
