const express = require('express')
const router = express.Router()
const createError = require('http-errors')
const User= require('../model/user.model')
const {authSchema} = require('../helper/vali_schema')
const {signAccessToken} = require('../helper/jwt')

router.post('/register',async (req,res,next)=>{
    // console.log(req.body)
    // //res.send("Register Route")
    // try {
    //     const {email, password} = req.body
    //     if(!email || !password) throw createError.BadRequest()
    //     // const result = await authSchema.validateAsync(req.body)
    //     // console.log(result)

    //     const doesExist = await User.findOne({email: email})
    //     if(doesExist ) throw createError.Conflict(`${email} alredy Exists`)

    //     const user = new User ({email : password})
    //     const saveuser = await user.save()

    //     res.send(saveuser)

    // } catch (error) {
    //     next(error)
    // }
    try {
        //const { email, password } = req.body
        //console.log(password)
        // if (!email || !password) throw createError.BadRequest()
        const result = await authSchema.validateAsync(req.body)
        //console.log(result)
        const doesExist = await User.findOne({ email: result.email })
        if (doesExist)
          throw createError.Conflict(`${result.email} is already been registered`)
  
        const user = new User(result)
        const savedUser = await user.save()
        const accessToken = await signAccessToken(savedUser.id) 
  
        //res.send(savedUser)
        res.send({accessToken})
      } catch (error) {
        if (error.isJoi === true) error.status = 422
        next(error)
      }
})

router.post('/login', async(req,res ,next)=>{
    //res.send("Login Route")
    try {
      const result = await authSchema.validateAsync(req.body)
      const user = await User.findOne({ email: result.email })
      if(!user) throw createError.NotFound('User Not Registered')

      const ismatch = await user.isValidPassword(result.password)
      if(!ismatch) throw createError.Unauthorized("Email / Password is not Valid")

      const accessToken = await signAccessToken(user.id)

       res.send({accessToken})
    } catch (error) {
      if (error.isJoi === true) next(createError("Invalid Email/Password"))
      next(error)
    }
})

router.post('/refresh-token', (req,res)=>{
    res.send("refresh-token Route")
})

router.post('/logout', (req,res)=>{
    res.send("logout Route")
})


module.exports = router