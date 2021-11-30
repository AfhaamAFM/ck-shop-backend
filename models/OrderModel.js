const mongoose = require('mongoose')

const orderSchema = new mongoose.Schema({

    user: { type: mongoose.Schema.Types.ObjectId, ref: 'user', required: true },
    orders: [{
         orderItem: { type: Array, required: true } ,
     orderStatus: { type: String, required: true } ,
     paymentMethod: { type: String, required: true } ,
    amount: { type: Number, required: true } ,
    address:{type:Object,required:true}

    }]
}, { timestamps: true })


module.exports=mongoose.model('orders',orderSchema)
