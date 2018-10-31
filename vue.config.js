const Dotenv = require('dotenv-webpack')
module.exports = {
  baseUrl: '/app/',
  configureWebpack: {
    plugins: [
      new Dotenv()
    ]
  }
}
