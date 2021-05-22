 
const express = require('express')
const morgan = require('morgan')
const createError = require('http-errors')
const AuthRoute = require('./route/auth_route')
require('dotenv').config()
require('./helper/mongodb')
const app= express()
app.use(morgan("dev"))
app.use(express.json())
app.use(express.urlencoded({extended:true}))
const PORT = process.env.PORT || 3000
const {verifyAccessToken} = require('./helper/jwt')

app.use('/auth',AuthRoute)

app.get('/', verifyAccessToken, async (req, res, next) => {
    res.send('Hello from express.')
    //console.log(req.headers['authorization'])
  })

  app.use(async (req, res, next) => {
    // const error= new Error ('Not Found1')
    // error.status=400
    // next(error)
    next(createError.NotFound())
  })
  
  app.use((err, req, res, next) => {
    res.status(err.status || 500)
    res.send({
      error: {
        status: err.status || 500,
        message: err.message,
      },
    })
  })

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
