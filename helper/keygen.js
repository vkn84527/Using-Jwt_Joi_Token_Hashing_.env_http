const crypto = require('crypto')
const key3 = crypto.randomBytes(32)
console.log(key3)

const key1 = crypto.randomBytes(32).toString('hex')
const key2 = crypto.randomBytes(32).toString('hex')
console.table({ key1, key2 })
