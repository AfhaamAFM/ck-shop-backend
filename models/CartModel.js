const mongoose =require('mongoose')


const cartSchema =new mongoose.Schema({

user :{type:mongoose.Schema.Types.ObjectId,ref:'user', required:true},
cartItem :[{

    product:{type:mongoose.Schema.Types.ObjectId,ref:'Products',required:true},
    price:{type:Number,required:true},
    size:{type:String,required:true},
    quantity:{type:Number,default:1}
}]


},{timestamps:true})

module.exports =mongoose.model('Cart',cartSchema)