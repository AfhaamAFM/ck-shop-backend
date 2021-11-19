const mongoose = require('mongoose')
const productSchema = new mongoose.Schema({

    name: { type: String, required: true },
    price: { type: Number, required: true },
    category: { type: String, required: true },
    subCat: { type: String, required: true },
    description: { type: String, required: true },
    isOffer: { type: Boolean },
    discountPrice: { type: Number },
    offerPrice: { type: Number },
    imageUrl:[{img:{type:String}}],
    color: { type: String },
    quantity: { type: Number, required: true },
    small: { type: Number },
    medium: { type: Number },
    large: { type: Number }
})

const newProduct = mongoose.model('Products', productSchema)

module.exports = newProduct