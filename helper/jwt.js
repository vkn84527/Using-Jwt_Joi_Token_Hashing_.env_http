const JWT = require('jsonwebtoken')
const createError = require('http-errors')
const { verify } = require('crypto')


module.exports = {
  signAccessToken: (userId) => {
    return new Promise((resolve, reject) => {
      const payload = {
        //iss : 'facebook.com'
      }
      const secret = process.env.ACCESS_TOKEN_SECRET   // "abcdefghijklmnopesrg"
      const options = {
        expiresIn: '1y',
        issuer: 'facebook.com',
        audience: userId,
      }
      JWT.sign(payload, secret, options, (err, token) => {
        if (err) {
          console.log(err.message)
          reject(createError.InternalServerError())
        }
        resolve(token)
      })
    })
  },
  verifyAccessToken: (req, res, next) => {
    if (!req.headers['authorization']) return next(createError.Unauthorized())
    const authHeader = req.headers['authorization']
    const bearerToken = authHeader.split(' ')
    const token = bearerToken[1]
    JWT.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, payload) => {
      if (err) {
        const message =
          err.name === 'JsonWebTokenError' ? 'Unauthorized' : err.message
        return next(createError.Unauthorized())
      }
      req.payload = payload
      next()
    })
  }
}

