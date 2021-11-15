const mongoose = require('mongoose')

const adminSchema = new mongoose.Schema({  
    name: { type: String, required: true },
    passwordHash: { type: String, required: true }
})
const newAdmin = mongoose.model("admin", adminSchema)
module.exports=newAdmin