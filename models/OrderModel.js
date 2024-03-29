const mongoose = require('mongoose')

const orderSchema = new mongoose.Schema({

    user: { type: mongoose.Schema.Types.ObjectId, ref: 'user', required: true },
    email: { type: String, required: true },
    orders: [{
        orderItem: { type: Array, required: true },
        orderStatus: { type: String },
        paymentMethod: { type: String, },
        amount: { type: Number, required: true },
        address: { type: Object, required: true },
        isPaid: { type: Boolean, required: true, default: false },
        paymentResult: {
            payId: { type: String ,default:null},
            status: { type: String ,default:'not paid'},
            payed_Date: { type: Date ,default:null},
        },
    

    }]
}, { timestamps: true })


module.exports = mongoose.model('orders', orderSchema)
