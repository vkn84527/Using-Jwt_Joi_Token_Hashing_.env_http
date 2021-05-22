const { string, func } = require('joi')
const mongoose = require('mongoose')
const Schema = mongoose.Schema
const bcrypt = require('bcrypt')

const UserSchema = new Schema({
  email: {
    type: String,
    required: true,
    lowercase: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
})

UserSchema.pre('save',async function (next) {
    try {
        const salt = await bcrypt.genSalt(10)
        //console.log(this.email,this.password)
        const hashedpassword =await bcrypt.hash(this.password,salt)
        this.password = hashedpassword
        console.log({
            "User_id":this.email,
            "bcrypt_Password" : hashedpassword})
        //next()

    } catch (error) { 
        console.log(error.message)
        next(error)
    }
    
})

UserSchema.methods.isValidPassword = async function (password) {
  try {
    return await bcrypt.compare(password,this.password)
  } catch (error) {
    throw error
  }
  
}

const User = mongoose.model('user', UserSchema)
module.exports = User
