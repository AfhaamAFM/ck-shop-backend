const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({

    name: { type: String, required: true },
    passwordHash: { type: String, required: true },
    isActive: { type: Boolean, required: true },
    phone: { type: String, required: true },
    email: { type: String, required: true },
    refCode:{type:String},
    wallet:{type:Number},
    address: [{
        name: { type: String, required: true },
        flatNo: { type: String, required: true },
        number: { type: String, required: true },
        pincode: { type: String, required: true },
        street: { type: String, required: true },
        district: { type: String, required: true },
        state: { type: String, required: true },
        landmark:{type:String,required:true}
    }],
  image:{public_id:{type:String},
url:{type:String}}  

})
const newUser = mongoose.model("user", userSchema)
module.exports = newUser