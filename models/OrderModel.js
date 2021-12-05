const mongoose = require('mongoose')

const orderSchema = new mongoose.Schema({

    user: { type: mongoose.Schema.Types.ObjectId, ref: 'user', required: true },
    email: { type: String, required: true },
    orders: [{
        orderId: { type: mongoose.Schema.Types.ObjectId, required: true },
        orderItem: { type: Array, required: true },
        orderStatus: { type: String, required: true },
        paymentMethod: { type: String, required: true },
        amount: { type: Number, required: true },
        address: { type: Object, required: true },
        isPaid: { type: Boolean, required: true, default: false },
        paidAt: { type: Date },
        paymentResult: {
            id: { type: String },
            status: { type: String },
            update_time: { type: Date },
            email_address: { type: String }

        }

    }]
}, { timestamps: true })


module.exports = mongoose.model('orders', orderSchema)
