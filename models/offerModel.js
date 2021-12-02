const mongoose =require('mongoose')

const offerSchema = new mongoose.Schema({

offerName:{type:String,required:true},
expiryDate:{type:Date,required:true},
percentage:{type:Number,required:true}


},{timestamps:true})

module.exports=mongoose.model('Offer',offerSchema)

