import { Router } from 'express'
import basicAuth from 'express-basic-auth'
import { UI } from 'bull-board'

const app = Router()
app.use(basicAuth({
  users: {
    [process.env.ADMIN_USERNAME]: process.env.ADMIN_PASSWORD
  },
  challenge: true,
  unauthorizedResponse: 'Authentication failed'
}))

// bull-board
app.use('/', UI)

export default app
