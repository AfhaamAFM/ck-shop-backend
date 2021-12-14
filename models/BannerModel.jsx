const mongoose = require('mongoose')
const bannerSchema = new mongoose.Schema({
  
    Banner: [{
        name: { type: String, required: true },
        img: { type: String },
        public_id: { type: String }
    }]
    
    
},{timestamps:true})

const newBanner = mongoose.model('Products', bannerSchema)

module.exports = newBanner