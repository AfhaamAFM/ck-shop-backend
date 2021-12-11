const mongoose =require('mongoose')

const coupenSchema = new mongoose.Schema({

name:{type:String,required:true},
expiryDate:{type:Date,required:true},
percentage:{type:Number,required:true}


},{timestamps:true})

module.exports=mongoose.model('Coupen',coupenSchema)