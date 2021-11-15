const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    
    name: { type: String, required: true },
    passwordHash: { type: String, required: true },
    isActive: { type: Boolean, required: true },
    phone: { type: String, required: true },
    email: {type:String,required:true}

})
const newUser = mongoose.model("user", userSchema)
module.exports=newUser